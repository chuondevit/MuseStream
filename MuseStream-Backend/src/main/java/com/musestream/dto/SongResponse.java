package com.musestream.dto;

import com.musestream.model.Song;

import java.time.LocalDate;

public record SongResponse(
        Long id,
        String title,
        Long artistId,
        String artistName,
        Long genreId,
        String genreName,
        String coverUrl,
        String audioUrl,
        Integer durationSeconds,
        int popularity,
        LocalDate releaseDate
) {
    /** Must be called inside a transaction (artist and genre are lazy). */
    public static SongResponse from(Song song) {
        return new SongResponse(
                song.getId(),
                song.getTitle(),
                song.getArtist() != null ? song.getArtist().getId() : null,
                song.getArtist() != null ? song.getArtist().getName() : null,
                song.getGenre() != null ? song.getGenre().getId() : null,
                song.getGenre() != null ? song.getGenre().getName() : null,
                song.getCoverUrl(),
                song.getAudioUrl(),
                song.getDurationSeconds(),
                song.getPopularity(),
                song.getReleaseDate());
    }
}
