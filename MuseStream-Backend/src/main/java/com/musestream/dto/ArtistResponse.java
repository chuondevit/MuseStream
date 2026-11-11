package com.musestream.dto;

import com.musestream.model.Artist;

public record ArtistResponse(Long id, String name, String biography, String imageUrl) {

    public static ArtistResponse from(Artist artist) {
        return new ArtistResponse(artist.getId(), artist.getName(), artist.getBiography(), artist.getImageUrl());
    }
}
