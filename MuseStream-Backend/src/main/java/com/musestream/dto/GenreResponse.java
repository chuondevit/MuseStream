package com.musestream.dto;

import com.musestream.model.Genre;

public record GenreResponse(Long id, String name, String description) {

    public static GenreResponse from(Genre genre) {
        return new GenreResponse(genre.getId(), genre.getName(), genre.getDescription());
    }
}
