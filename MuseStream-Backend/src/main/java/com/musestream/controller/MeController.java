package com.musestream.controller;

import com.musestream.dto.HistoryItemResponse;
import com.musestream.dto.OnboardingRequest;
import com.musestream.dto.PreferencesResponse;
import com.musestream.dto.SongResponse;
import com.musestream.security.AuthUser;
import com.musestream.service.HistoryService;
import com.musestream.service.LibraryService;
import com.musestream.service.PreferenceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Everything that belongs to the signed-in user: preferences, liked songs, recently played. */
@RestController
@RequestMapping("/api/me")
public class MeController {

    private final PreferenceService preferenceService;
    private final LibraryService libraryService;
    private final HistoryService historyService;

    public MeController(PreferenceService preferenceService, LibraryService libraryService,
                        HistoryService historyService) {
        this.preferenceService = preferenceService;
        this.libraryService = libraryService;
        this.historyService = historyService;
    }

    @GetMapping("/preferences")
    public PreferencesResponse preferences(@AuthenticationPrincipal AuthUser user) {
        return preferenceService.get(user.id());
    }

    /** "Change preferences" in the profile page. Replaces songs, artists and genres. */
    @PutMapping("/preferences")
    public PreferencesResponse updatePreferences(@AuthenticationPrincipal AuthUser user,
                                                 @Valid @RequestBody OnboardingRequest request) {
        return preferenceService.save(user.id(), request);
    }

    @GetMapping("/likes")
    public List<SongResponse> likes(@AuthenticationPrincipal AuthUser user) {
        return libraryService.likedSongs(user.id());
    }

    /** Only the ids - handy to draw the heart icons on song cards. */
    @GetMapping("/likes/ids")
    public List<Long> likeIds(@AuthenticationPrincipal AuthUser user) {
        return libraryService.likedSongIds(user.id());
    }

    @PostMapping("/likes/{songId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void like(@AuthenticationPrincipal AuthUser user, @PathVariable Long songId) {
        libraryService.like(user.id(), songId);
    }

    @DeleteMapping("/likes/{songId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unlike(@AuthenticationPrincipal AuthUser user, @PathVariable Long songId) {
        libraryService.unlike(user.id(), songId);
    }

    @GetMapping("/history")
    public List<HistoryItemResponse> history(@AuthenticationPrincipal AuthUser user,
                                             @RequestParam(defaultValue = "20") int limit) {
        return historyService.recentlyPlayed(user.id(), limit);
    }
}
