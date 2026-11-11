package com.musestream.repository;

import com.musestream.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    List<Artist> findAllByOrderByNameAsc();

    List<Artist> findByNameContainingIgnoreCaseOrderByNameAsc(String name);
}
