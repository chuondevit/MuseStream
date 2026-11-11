package com.musestream.dto;

import com.musestream.model.Playlist;

import java.time.LocalDateTime;
import java.util.List;

public record PlaylistResponse(
        Long id,
        String name,
        String description,
        String coverUrl,
        boolean isPublic,
        long songCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<SongResponse> songs
) {
    public static PlaylistResponse from(Playlist p, long songCount, List<SongResponse> songs) {
        return new PlaylistResponse(p.getId(), p.getName(), p.getDescription(), p.getCoverUrl(),
                p.isPublicPlaylist(), songCount, p.getCreatedAt(), p.getUpdatedAt(), songs);
    }
}
