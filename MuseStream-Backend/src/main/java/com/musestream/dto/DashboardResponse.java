package com.musestream.dto;

import java.time.LocalDate;
import java.util.List;

public record DashboardResponse(
        long totalPlays,
        long uniqueSongs,
        long listeningSeconds,
        NamedCount favoriteGenre,
        ArtistStat topArtist,
        List<NamedCount> topGenres,
        List<ArtistStat> topArtists,
        List<SongStat> topSongs,
        List<DayStat> playsLast7Days,
        List<SongResponse> recentlyPlayed
) {
    public record NamedCount(Long id, String name, long plays) {
    }

    public record ArtistStat(Long id, String name, String imageUrl, long plays) {
    }

    public record SongStat(SongResponse song, long plays) {
    }

    public record DayStat(LocalDate date, long plays) {
    }
}
