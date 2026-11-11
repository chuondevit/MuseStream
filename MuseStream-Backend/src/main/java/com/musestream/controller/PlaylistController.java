package com.musestream.controller;

import com.musestream.dto.PlaylistRequest;
import com.musestream.dto.PlaylistResponse;
import com.musestream.security.AuthUser;
import com.musestream.service.PlaylistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    private final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @GetMapping
    public List<PlaylistResponse> list(@AuthenticationPrincipal AuthUser user) {
        return playlistService.list(user.id());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlaylistResponse create(@AuthenticationPrincipal AuthUser user,
                                   @Valid @RequestBody PlaylistRequest request) {
        return playlistService.create(user.id(), request);
    }

    @GetMapping("/{id}")
    public PlaylistResponse get(@AuthenticationPrincipal AuthUser user, @PathVariable Long id) {
        return playlistService.get(user.id(), id);
    }

    @PutMapping("/{id}")
    public PlaylistResponse update(@AuthenticationPrincipal AuthUser user, @PathVariable Long id,
                                   @Valid @RequestBody PlaylistRequest request) {
        return playlistService.update(user.id(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal AuthUser user, @PathVariable Long id) {
        playlistService.delete(user.id(), id);
    }

    @PostMapping("/{id}/songs/{songId}")
    @ResponseStatus(HttpStatus.CREATED)
    public PlaylistResponse addSong(@AuthenticationPrincipal AuthUser user, @PathVariable Long id,
                                    @PathVariable Long songId) {
        return playlistService.addSong(user.id(), id, songId);
    }

    @DeleteMapping("/{id}/songs/{songId}")
    public PlaylistResponse removeSong(@AuthenticationPrincipal AuthUser user, @PathVariable Long id,
                                       @PathVariable Long songId) {
        return playlistService.removeSong(user.id(), id, songId);
    }
}
