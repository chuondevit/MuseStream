package com.musestream.security;

/** The authenticated principal placed in the SecurityContext after the JWT is verified. */
public record AuthUser(Long id, String email) {
}
