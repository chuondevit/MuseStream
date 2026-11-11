package com.musestream.repository;

import com.musestream.model.PlaylistSong;
import com.musestream.model.PlaylistSongId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, PlaylistSongId> {

    @Query("select ps from PlaylistSong ps join fetch ps.song s left join fetch s.artist left join fetch s.genre "
            + "where ps.playlist.id = :playlistId order by ps.sortOrder asc")
    List<PlaylistSong> findByPlaylistOrdered(@Param("playlistId") Long playlistId);

    @Query("select count(ps) from PlaylistSong ps where ps.playlist.id = :playlistId")
    long countByPlaylist(@Param("playlistId") Long playlistId);

    @Query("select coalesce(max(ps.sortOrder), -1) from PlaylistSong ps where ps.playlist.id = :playlistId")
    int maxPosition(@Param("playlistId") Long playlistId);

    /** Rows of [playlistId, songCount] for every playlist of a user. */
    @Query("select ps.playlist.id, count(ps) from PlaylistSong ps where ps.playlist.user.id = :userId group by ps.playlist.id")
    List<Object[]> countSongsByUser(@Param("userId") Long userId);
}
