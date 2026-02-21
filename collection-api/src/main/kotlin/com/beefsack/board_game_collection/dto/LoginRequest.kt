package com.beefsack.board_game_collection.dto

import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @NotBlank val email: String,
    @NotBlank val password: String,
)
