package com.musestream.dto;

import java.time.LocalDateTime;

public record HistoryItemResponse(SongResponse song, LocalDateTime playedAt) {
}
