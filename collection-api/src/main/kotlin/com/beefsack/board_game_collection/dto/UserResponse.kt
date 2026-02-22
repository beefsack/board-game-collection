package com.beefsack.board_game_collection.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.util.UUID

data class UserResponse(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val id: UUID,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val email: String,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val displayName: String,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val role: String,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val gameCount: Int = 0,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val topGames: List<BoardGameResponse> = emptyList(),
)
