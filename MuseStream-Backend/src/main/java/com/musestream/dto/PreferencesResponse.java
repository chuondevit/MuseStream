package com.musestream.dto;

import java.util.List;

public record PreferencesResponse(
        boolean onboardingCompleted,
        List<SongResponse> favoriteSongs,
        List<ArtistResponse> favoriteArtists,
        List<GenreResponse> genres
) {
}
