package com.beefsack.board_game_collection.dto

import java.time.Instant
import java.util.UUID

data class DesignerResponse(
    val id: UUID?,
    val name: String?,
    val gameCount: Int = 0,
    val createdAt: Instant?,
    val updatedAt: Instant?,
)
