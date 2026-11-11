package com.musestream.exception;

import java.time.LocalDateTime;
import java.util.Map;

/** Uniform JSON error body returned by every failing endpoint. */
public record ApiError(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> fieldErrors
) {
}
