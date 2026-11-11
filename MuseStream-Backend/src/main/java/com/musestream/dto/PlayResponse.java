package com.musestream.dto;

import java.time.LocalDateTime;

public record PlayResponse(Long songId, LocalDateTime playedAt, long totalPlays) {
}
