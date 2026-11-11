package com.musestream.service;

import com.musestream.dto.PlaylistRequest;
import com.musestream.dto.PlaylistResponse;
import com.musestream.dto.SongResponse;
import com.musestream.exception.ApiException;
import com.musestream.model.Playlist;
import com.musestream.model.PlaylistSong;
import com.musestream.model.PlaylistSongId;
import com.musestream.model.Song;
import com.musestream.repository.PlaylistRepository;
import com.musestream.repository.PlaylistSongRepository;
import com.musestream.repository.SongRepository;
import com.musestream.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    public PlaylistService(PlaylistRepository playlistRepository, PlaylistSongRepository playlistSongRepository,
                           SongRepository songRepository, UserRepository userRepository) {
        this.playlistRepository = playlistRepository;
        this.playlistSongRepository = playlistSongRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<PlaylistResponse> list(Long userId) {
        Map<Long, Long> counts = new HashMap<>();
        for (Object[] row : playlistSongRepository.countSongsByUser(userId)) {
            counts.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
        }
        return playlistRepository.findByUserIdOrderByUpdatedAtDesc(userId).stream()
                .map(p -> PlaylistResponse.from(p, counts.getOrDefault(p.getId(), 0L), null))
                .toList();
    }

    @Transactional
    public PlaylistResponse create(Long userId, PlaylistRequest req) {
        Playlist playlist = new Playlist(userRepository.getReferenceById(userId), req.name().trim());
        apply(playlist, req);
        playlistRepository.save(playlist);
        return PlaylistResponse.from(playlist, 0, List.of());
    }

    /** Owner can always read; other users can read only public playlists. */
    @Transactional(readOnly = true)
    public PlaylistResponse get(Long userId, Long playlistId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> ApiException.notFound("Playlist not found: " + playlistId));
        boolean owner = playlist.getUser().getId().equals(userId);
        if (!owner && !playlist.isPublicPlaylist()) {
            throw ApiException.notFound("Playlist not found: " + playlistId);
        }
        return toDetail(playlist);
    }

    @Transactional
    public PlaylistResponse update(Long userId, Long playlistId, PlaylistRequest req) {
        Playlist playlist = ownedPlaylist(userId, playlistId);
        playlist.setName(req.name().trim());
        apply(playlist, req);
        return toDetail(playlist);
    }

    @Transactional
    public void delete(Long userId, Long playlistId) {
        playlistRepository.delete(ownedPlaylist(userId, playlistId));
    }

    @Transactional
    public PlaylistResponse addSong(Long userId, Long playlistId, Long songId) {
        Playlist playlist = ownedPlaylist(userId, playlistId);
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> ApiException.notFound("Song not found: " + songId));
        if (playlistSongRepository.existsById(new PlaylistSongId(playlistId, songId))) {
            throw ApiException.conflict("Song is already in this playlist");
        }
        int position = playlistSongRepository.maxPosition(playlistId) + 1;
        playlistSongRepository.saveAndFlush(new PlaylistSong(playlist, song, position));
        playlist.touch();
        return toDetail(playlist);
    }

    @Transactional
    public PlaylistResponse removeSong(Long userId, Long playlistId, Long songId) {
        Playlist playlist = ownedPlaylist(userId, playlistId);
        PlaylistSongId id = new PlaylistSongId(playlistId, songId);
        if (!playlistSongRepository.existsById(id)) {
            throw ApiException.notFound("Song is not in this playlist");
        }
        playlistSongRepository.deleteById(id);
        playlistSongRepository.flush();
        playlist.touch();
        return toDetail(playlist);
    }

    private Playlist ownedPlaylist(Long userId, Long playlistId) {
        return playlistRepository.findByIdAndUserId(playlistId, userId)
                .orElseThrow(() -> ApiException.notFound("Playlist not found: " + playlistId));
    }

    private void apply(Playlist playlist, PlaylistRequest req) {
        playlist.setDescription(req.description());
        playlist.setCoverUrl(req.coverUrl());
        if (req.isPublic() != null) {
            playlist.setPublicPlaylist(req.isPublic());
        }
    }

    private PlaylistResponse toDetail(Playlist playlist) {
        List<SongResponse> songs = playlistSongRepository.findByPlaylistOrdered(playlist.getId()).stream()
                .map(ps -> SongResponse.from(ps.getSong()))
                .toList();
        return PlaylistResponse.from(playlist, songs.size(), songs);
    }
}
