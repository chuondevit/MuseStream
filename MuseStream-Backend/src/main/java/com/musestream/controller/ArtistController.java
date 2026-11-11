package com.musestream.controller;

import com.musestream.dto.ArtistResponse;
import com.musestream.dto.SongResponse;
import com.musestream.service.ArtistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artists")
public class ArtistController {

    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @GetMapping
    public List<ArtistResponse> list(@RequestParam(required = false) String q) {
        return artistService.list(q);
    }

    @GetMapping("/popular")
    public List<ArtistResponse> popular(@RequestParam(defaultValue = "10") int limit) {
        return artistService.popular(limit);
    }

    @GetMapping("/{id}")
    public ArtistResponse get(@PathVariable Long id) {
        return artistService.get(id);
    }

    @GetMapping("/{id}/songs")
    public List<SongResponse> songs(@PathVariable Long id) {
        return artistService.songs(id);
    }
}
