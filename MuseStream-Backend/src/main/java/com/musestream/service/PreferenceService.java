package com.musestream.service;

import com.musestream.dto.*;
import com.musestream.exception.ApiException;
import com.musestream.model.Artist;
import com.musestream.model.Genre;
import com.musestream.model.Song;
import com.musestream.model.User;
import com.musestream.repository.ArtistRepository;
import com.musestream.repository.GenreRepository;
import com.musestream.repository.SongRepository;
import com.musestream.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * First-time personalization ("onboarding") and later preference changes.
 * Favorite songs are the same records as the user's Liked Songs.
 */
@Service
public class PreferenceService {

    private static final int ONBOARDING_SONG_POOL = 60;

    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;

    public PreferenceService(UserRepository userRepository, SongRepository songRepository,
                             ArtistRepository artistRepository, GenreRepository genreRepository) {
        this.userRepository = userRepository;
        this.songRepository = songRepository;
        this.artistRepository = artistRepository;
        this.genreRepository = genreRepository;
    }

    @Transactional(readOnly = true)
    public OnboardingOptionsResponse options() {
        List<SongResponse> songs = songRepository
                .findAll(SongService.pageable(0, ONBOARDING_SONG_POOL, SongService.BY_POPULARITY))
                .getContent().stream().map(SongResponse::from).toList();
        List<ArtistResponse> artists = artistRepository.findAllByOrderByNameAsc()
                .stream().map(ArtistResponse::from).toList();
        List<GenreResponse> genres = genreRepository.findAllByOrderByNameAsc()
                .stream().map(GenreResponse::from).toList();
        return new OnboardingOptionsResponse(songs, artists, genres);
    }

    /** Saves the three choices and marks onboarding as completed. Replaces earlier choices. */
    @Transactional
    public PreferencesResponse save(Long userId, OnboardingRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User no longer exists"));

        List<Song> songs = loadAll(req.favoriteSongIds(), songRepository.findAllById(distinct(req.favoriteSongIds())),
                "song");
        List<Artist> artists = loadAll(req.favoriteArtistIds(),
                artistRepository.findAllById(distinct(req.favoriteArtistIds())), "artist");
        List<Genre> genres = loadAll(req.genreIds(), genreRepository.findAllById(distinct(req.genreIds())), "genre");

        user.getFavoriteSongs().clear();
        user.getFavoriteSongs().addAll(songs);
        user.getFavoriteArtists().clear();
        user.getFavoriteArtists().addAll(artists);
        user.getPreferredGenres().clear();
        user.getPreferredGenres().addAll(genres);
        user.setOnboardingCompleted(true);
        // "user" is a managed entity inside this transaction: changes are flushed on commit,
        // so no explicit save() (and no merge) is needed.

        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public PreferencesResponse get(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User no longer exists"));
        return toResponse(user);
    }

    private PreferencesResponse toResponse(User user) {
        return new PreferencesResponse(
                user.isOnboardingCompleted(),
                user.getFavoriteSongs().stream()
                        .sorted(Comparator.comparing(Song::getTitle, String.CASE_INSENSITIVE_ORDER))
                        .map(SongResponse::from).toList(),
                user.getFavoriteArtists().stream()
                        .sorted(Comparator.comparing(Artist::getName, String.CASE_INSENSITIVE_ORDER))
                        .map(ArtistResponse::from).toList(),
                user.getPreferredGenres().stream()
                        .sorted(Comparator.comparing(Genre::getName, String.CASE_INSENSITIVE_ORDER))
                        .map(GenreResponse::from).toList());
    }

    private static Set<Long> distinct(List<Long> ids) {
        return new LinkedHashSet<>(ids);
    }

    /** Fails with 400 when any requested id does not exist. */
    private static <T> List<T> loadAll(List<Long> requested, List<T> found, String what) {
        if (found.size() != distinct(requested).size()) {
            throw ApiException.badRequest("One or more " + what + " ids do not exist");
        }
        return found;
    }
}
