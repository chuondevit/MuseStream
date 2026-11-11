package com.musestream.dto;

import java.util.List;

/** A recommended song with its score and the human-readable reasons behind it. */
public record RecommendedSongResponse(
        SongResponse song,
        int score,
        List<String> reasons
) {
}
