package com.musestream.controller;

import com.musestream.dto.*;
import com.musestream.security.AuthUser;
import com.musestream.service.PreferenceService;
import com.musestream.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.musestream.dto.*;
import com.musestream.security.AuthUser;
import com.musestream.service.PreferenceService;
import com.musestream.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final PreferenceService preferenceService;

    public RecommendationController(RecommendationService recommendationService, PreferenceService preferenceService) {
        this.recommendationService = recommendationService;
        this.preferenceService = preferenceService;
    }

    /** Songs, artists and genres to show in the 3-step onboarding screen. */
    @GetMapping("/onboarding/options")
    public OnboardingOptionsResponse onboardingOptions() {
        return preferenceService.options();
    }

    /** Saves the first-time choices and sets onboardingCompleted = true. */
    @PostMapping("/onboarding")
    public PreferencesResponse onboarding(@AuthenticationPrincipal AuthUser user,
                                          @Valid @RequestBody OnboardingRequest request) {
        return preferenceService.save(user.id(), request);
    }

    /** "Recommended For You" - top N songs by recommendation score. */
    @GetMapping
    public List<RecommendedSongResponse> recommendations(@AuthenticationPrincipal AuthUser user,
                                                         @RequestParam(defaultValue = "10") int limit) {
        return recommendationService.recommend(user.id(), limit);
    }

    /** Call when the user starts playing a song: stores it in the listening history. */
    @PostMapping("/play/{songId}")
    public PlayResponse play(@AuthenticationPrincipal AuthUser user, @PathVariable Long songId) {
        return recommendationService.recordPlay(user.id(), songId);
    }
}
