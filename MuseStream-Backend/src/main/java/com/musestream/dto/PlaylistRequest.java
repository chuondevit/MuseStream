package com.musestream.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PlaylistRequest(
        @NotBlank(message = "Playlist name is required")
        @Size(max = 150, message = "Playlist name must be at most 150 characters")
        String name,

        @Size(max = 2000, message = "Description must be at most 2000 characters")
        String description,

        String coverUrl,

        Boolean isPublic
) {
}
