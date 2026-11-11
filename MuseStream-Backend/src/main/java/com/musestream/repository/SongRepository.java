package com.musestream.repository;

import com.musestream.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {

    Page<Song> findByGenreId(Long genreId, Pageable pageable);

    Page<Song> findByArtistId(Long artistId, Pageable pageable);

    List<Song> findByArtistIdOrderByPopularityDesc(Long artistId);

    /** Search by title, artist name or genre name. {@code q} must be non-null. */
    @Query("select s from Song s left join s.artist a left join s.genre g "
            + "where lower(s.title) like lower(concat('%', :q, '%')) "
            + "or lower(a.name) like lower(concat('%', :q, '%')) "
            + "or lower(g.name) like lower(concat('%', :q, '%'))")
    Page<Song> search(@Param("q") String q, Pageable pageable);

    @Modifying
    @Query("update Song s set s.popularity = s.popularity + 1 where s.id = :id")
    int incrementPopularity(@Param("id") Long id);

    /** Rows of [artistId, sum(popularity)] used to rank popular artists. */
    @Query("select s.artist.id, sum(s.popularity) from Song s where s.artist is not null group by s.artist.id")
    List<Object[]> sumPopularityByArtist();
}
