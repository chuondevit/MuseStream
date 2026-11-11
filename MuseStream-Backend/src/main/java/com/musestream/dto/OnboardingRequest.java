package com.musestream.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/** First-time personalization: favorite songs, artists and genres. */
public record OnboardingRequest(
        @NotNull(message = "favoriteSongIds is required")
        @Size(min = 3, message = "Please choose at least 3 songs")
        List<@NotNull(message = "Song id must not be null") Long> favoriteSongIds,

        @NotNull(message = "favoriteArtistIds is required")
        @Size(min = 1, message = "Please choose at least 1 artist")
        List<@NotNull(message = "Artist id must not be null") Long> favoriteArtistIds,

        @NotNull(message = "genreIds is required")
        @Size(min = 1, message = "Please choose at least 1 genre")
        List<@NotNull(message = "Genre id must not be null") Long> genreIds
) {
}
