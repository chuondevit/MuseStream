package com.musestream.repository;

import com.musestream.model.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    List<Playlist> findByUserIdOrderByUpdatedAtDesc(Long userId);

    Optional<Playlist> findByIdAndUserId(Long id, Long userId);
}
