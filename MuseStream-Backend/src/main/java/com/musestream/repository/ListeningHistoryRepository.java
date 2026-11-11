package com.musestream.repository;

import com.musestream.model.ListeningHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ListeningHistoryRepository extends JpaRepository<ListeningHistory, Long> {

    /** Most recent plays first. Returns a List (not a Page) because of the fetch joins. */
    @Query("select h from ListeningHistory h join fetch h.song s left join fetch s.artist left join fetch s.genre "
            + "where h.user.id = :userId order by h.playedAt desc, h.id desc")
    List<ListeningHistory> findRecent(@Param("userId") Long userId, Pageable pageable);

    long countByUserId(Long userId);

    @Query("select count(distinct h.song.id) from ListeningHistory h where h.user.id = :userId")
    long countDistinctSongs(@Param("userId") Long userId);

    /** Total seconds of all plays, based on each song's duration_seconds. */
    @Query("select coalesce(sum(s.durationSeconds), 0L) from ListeningHistory h join h.song s where h.user.id = :userId")
    Long totalListeningSeconds(@Param("userId") Long userId);

    /** Rows of [genreId, genreName, plays], most played first. */
    @Query("select g.id, g.name, count(h) from ListeningHistory h join h.song s join s.genre g "
            + "where h.user.id = :userId group by g.id, g.name order by count(h) desc, g.name asc")
    List<Object[]> topGenres(@Param("userId") Long userId, Pageable pageable);

    /** Rows of [artistId, artistName, imageUrl, plays], most played first. */
    @Query("select a.id, a.name, a.imageUrl, count(h) from ListeningHistory h join h.song s join s.artist a "
            + "where h.user.id = :userId group by a.id, a.name, a.imageUrl order by count(h) desc, a.name asc")
    List<Object[]> topArtists(@Param("userId") Long userId, Pageable pageable);

    /** Rows of [songId, plays], most played first. */
    @Query("select s.id, count(h) from ListeningHistory h join h.song s "
            + "where h.user.id = :userId group by s.id order by count(h) desc, s.id asc")
    List<Object[]> topSongs(@Param("userId") Long userId, Pageable pageable);

    /** Rows of [day, plays] since the given moment, oldest first. */
    @Query(value = "select cast(played_at as date) as day, count(*) as plays from listening_history "
            + "where user_id = :userId and played_at >= :since "
            + "group by cast(played_at as date) order by day", nativeQuery = true)
    List<Object[]> playsPerDay(@Param("userId") Long userId, @Param("since") LocalDateTime since);
}
