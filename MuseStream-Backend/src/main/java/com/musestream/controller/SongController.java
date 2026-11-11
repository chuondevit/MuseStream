package com.musestream.controller;

import com.musestream.dto.PageResponse;
import com.musestream.dto.SongResponse;
import com.musestream.service.SongService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public PageResponse<SongResponse> list(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size,
                                           @RequestParam(required = false) Long genreId,
                                           @RequestParam(required = false) Long artistId) {
        return songService.list(page, size, genreId, artistId);
    }

    @GetMapping("/popular")
    public List<SongResponse> popular(@RequestParam(defaultValue = "10") int limit) {
        return songService.popular(limit);
    }

    @GetMapping("/new")
    public List<SongResponse> newReleases(@RequestParam(defaultValue = "10") int limit) {
        return songService.newReleases(limit);
    }

    @GetMapping("/search")
    public PageResponse<SongResponse> search(@RequestParam String q,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "20") int size) {
        return songService.search(q, page, size);
    }

    @GetMapping("/{id}")
    public SongResponse get(@PathVariable Long id) {
        return songService.get(id);
    }
}
