package com.beefsack.board_game_collection.dto

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant
import java.util.UUID

data class DesignerResponse(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val id: UUID,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val name: String,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val gameCount: Int = 0,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val topGames: List<BoardGameResponse> = emptyList(),
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val createdAt: Instant,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val updatedAt: Instant,
)
