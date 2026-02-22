package com.beefsack.board_game_collection.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.util.UUID

data class AuthResponse(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val token: String,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val userId: UUID,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val displayName: String,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val role: String,
)
