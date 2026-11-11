package com.musestream.service;

import com.musestream.dto.GenreResponse;
import com.musestream.repository.GenreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class GenreService {

    private final GenreRepository genreRepository;

    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public List<GenreResponse> list() {
        return genreRepository.findAllByOrderByNameAsc().stream().map(GenreResponse::from).toList();
    }
}
