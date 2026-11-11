package com.musestream.service;

import com.musestream.dto.PlayResponse;
import com.musestream.dto.RecommendedSongResponse;
import com.musestream.dto.SongResponse;
import com.musestream.exception.ApiException;
import com.musestream.model.Artist;
import com.musestream.model.Genre;
import com.musestream.model.ListeningHistory;
import com.musestream.model.Song;
import com.musestream.model.User;
import com.musestream.repository.ListeningHistoryRepository;
import com.musestream.repository.SongRepository;
import com.musestream.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Rule-based personalized recommendation engine.
 *
 * <pre>
 *   Same preferred genre ............ +40
 *   Same favorite artist ............ +35
 *   Similar to favorite songs ....... +15  (shares the genre or artist of a liked song)
 *   Similar listening history ....... +10  (shares the genre or artist of a recent play)
 * </pre>
 *
 * Every song is scored, sorted by score (ties broken by popularity) and the top N are returned
 * together with the reasons, which makes the algorithm easy to explain and demonstrate.
 * Scores are computed on demand, so a new play immediately changes the next result.
 */
@Service
public class RecommendationService {

    public static final int GENRE_SCORE = 40;
    public static final int ARTIST_SCORE = 35;
    public static final int SIMILAR_SONG_SCORE = 15;
    public static final int HISTORY_SCORE = 10;

    /** Number of most recent plays that count as "listening history" for scoring. */
    private static final int HISTORY_WINDOW = 50;
    /** Songs among the last few plays are not recommended again right away. */
    private static final int RECENT_EXCLUDE = 5;

    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final ListeningHistoryRepository historyRepository;

    public RecommendationService(UserRepository userRepository, SongRepository songRepository,
                                 ListeningHistoryRepository historyRepository) {
        this.userRepository = userRepository;
        this.songRepository = songRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional(readOnly = true)
    public List<RecommendedSongResponse> recommend(Long userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User no longer exists"));
        int max = Math.max(1, Math.min(limit, 50));

        Set<Long> preferredGenres = ids(user.getPreferredGenres(), Genre::getId);
        Set<Long> favoriteArtists = ids(user.getFavoriteArtists(), Artist::getId);
        Set<Long> likedSongIds = ids(user.getFavoriteSongs(), Song::getId);
        Set<Long> likedGenres = user.getFavoriteSongs().stream()
                .map(Song::getGenre).filter(Objects::nonNull).map(Genre::getId).collect(Collectors.toSet());
        Set<Long> likedArtists = user.getFavoriteSongs().stream()
                .map(Song::getArtist).filter(Objects::nonNull).map(Artist::getId).collect(Collectors.toSet());

        List<ListeningHistory> history = historyRepository.findRecent(userId, PageRequest.of(0, HISTORY_WINDOW));
        Set<Long> historyGenres = new HashSet<>();
        Set<Long> historyArtists = new HashSet<>();
        Set<Long> justPlayed = new HashSet<>();
        for (int i = 0; i < history.size(); i++) {
            Song played = history.get(i).getSong();
            if (played.getGenre() != null) historyGenres.add(played.getGenre().getId());
            if (played.getArtist() != null) historyArtists.add(played.getArtist().getId());
            if (i < RECENT_EXCLUDE) justPlayed.add(played.getId());
        }

        List<Scored> scored = new ArrayList<>();
        for (Song song : songRepository.findAll()) {
            if (likedSongIds.contains(song.getId()) || justPlayed.contains(song.getId())) {
                continue; // the user already knows these
            }
            Long genreId = song.getGenre() != null ? song.getGenre().getId() : null;
            Long artistId = song.getArtist() != null ? song.getArtist().getId() : null;
            int score = 0;
            List<String> reasons = new ArrayList<>();

            if (genreId != null && preferredGenres.contains(genreId)) {
                score += GENRE_SCORE;
                reasons.add("Matches your favorite genre: " + song.getGenre().getName());
            }
            if (artistId != null && favoriteArtists.contains(artistId)) {
                score += ARTIST_SCORE;
                reasons.add("From your favorite artist: " + song.getArtist().getName());
            }
            if ((genreId != null && likedGenres.contains(genreId)) || (artistId != null && likedArtists.contains(artistId))) {
                score += SIMILAR_SONG_SCORE;
                reasons.add("Similar to songs you like");
            }
            if ((genreId != null && historyGenres.contains(genreId)) || (artistId != null && historyArtists.contains(artistId))) {
                score += HISTORY_SCORE;
                reasons.add("Based on your listening history");
            }
            if (reasons.isEmpty()) {
                reasons.add("Trending on MuseStream");
            }
            scored.add(new Scored(song, score, reasons));
        }

        return scored.stream()
                .sorted(Comparator.comparingInt(Scored::score).reversed()
                        .thenComparing(Comparator.comparingInt((Scored s) -> s.song().getPopularity()).reversed())
                        .thenComparing(s -> s.song().getId()))
                .limit(max)
                .map(s -> new RecommendedSongResponse(SongResponse.from(s.song()), s.score(), s.reasons()))
                .toList();
    }

    /** Stores a play in the listening history and bumps the song's popularity. */
    @Transactional
    public PlayResponse recordPlay(Long userId, Long songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> ApiException.notFound("Song not found: " + songId));
        ListeningHistory entry = historyRepository.save(new ListeningHistory(userRepository.getReferenceById(userId), song));
        songRepository.incrementPopularity(songId);
        return new PlayResponse(songId, entry.getPlayedAt(), historyRepository.countByUserId(userId));
    }

    private static <T> Set<Long> ids(Collection<T> items, java.util.function.Function<T, Long> idOf) {
        return items.stream().map(idOf).collect(Collectors.toSet());
    }

    private record Scored(Song song, int score, List<String> reasons) {
    }
}
