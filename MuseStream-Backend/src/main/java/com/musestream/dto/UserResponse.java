package com.musestream.dto;

import com.musestream.model.User;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String username,
        String email,
        boolean onboardingCompleted,
        LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(),
                user.isOnboardingCompleted(), user.getCreatedAt());
    }
}
