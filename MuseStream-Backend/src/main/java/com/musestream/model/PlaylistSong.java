package com.musestream.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/** Join entity between a playlist and a song; keeps the song order. */
@Entity
@Table(name = "playlist_songs")
public class PlaylistSong {

    @EmbeddedId
    private PlaylistSongId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("playlistId")
    @JoinColumn(name = "playlist_id")
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("songId")
    @JoinColumn(name = "song_id")
    private Song song;

    /** Column name is "position"; the Java field avoids the HQL function name. */
    @Column(name = "position", nullable = false)
    private int sortOrder;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    protected PlaylistSong() {
    }

    public PlaylistSong(Playlist playlist, Song song, int sortOrder) {
        this.id = new PlaylistSongId(playlist.getId(), song.getId());
        this.playlist = playlist;
        this.song = song;
        this.sortOrder = sortOrder;
        this.addedAt = LocalDateTime.now();
    }

    public PlaylistSongId getId() { return id; }
    public Playlist getPlaylist() { return playlist; }
    public Song getSong() { return song; }
    public int getSortOrder() { return sortOrder; }
    public LocalDateTime getAddedAt() { return addedAt; }
}
