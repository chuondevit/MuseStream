package com.musestream.dto;

import java.util.List;

/** Everything the onboarding screen needs to render its three steps. */
public record OnboardingOptionsResponse(
        List<SongResponse> songs,
        List<ArtistResponse> artists,
        List<GenreResponse> genres
) {
}
