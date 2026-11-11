package com.musestream.service;

import com.musestream.dto.SongResponse;
import com.musestream.exception.ApiException;
import com.musestream.model.Song;
import com.musestream.model.User;
import com.musestream.repository.SongRepository;
import com.musestream.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

/** "Liked Songs": backed by the user_favorite_songs table. */
@Service
public class LibraryService {

    private final UserRepository userRepository;
    private final SongRepository songRepository;

    public LibraryService(UserRepository userRepository, SongRepository songRepository) {
        this.userRepository = userRepository;
        this.songRepository = songRepository;
    }

    @Transactional(readOnly = true)
    public List<SongResponse> likedSongs(Long userId) {
        return loadUser(userId).getFavoriteSongs().stream()
                .sorted(Comparator.comparing(Song::getTitle, String.CASE_INSENSITIVE_ORDER))
                .map(SongResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Long> likedSongIds(Long userId) {
        return userRepository.findLikedSongIds(userId);
    }

    @Transactional
    public void like(Long userId, Long songId) {
        User user = loadUser(userId);
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> ApiException.notFound("Song not found: " + songId));
        user.getFavoriteSongs().add(song); // Set semantics: liking twice is a no-op
    }

    @Transactional
    public void unlike(Long userId, Long songId) {
        User user = loadUser(userId);
        user.getFavoriteSongs().removeIf(s -> s.getId().equals(songId));
    }

    private User loadUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User no longer exists"));
    }
}
