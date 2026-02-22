package com.beefsack.board_game_collection.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RegisterRequest(
    @NotBlank val displayName: String,
    @Email @NotBlank val email: String,
    @Size(min = 8) @NotBlank val password: String,
)
