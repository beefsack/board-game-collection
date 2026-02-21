package com.beefsack.board_game_collection.dto

import jakarta.validation.constraints.NotBlank
import java.math.BigDecimal
import java.util.UUID

data class BoardGameRequest(
    @NotBlank val title: String,
    val yearPublished: Int?,
    val minPlayers: Int?,
    val maxPlayers: Int?,
    val playTimeMinutes: Int?,
    val weight: BigDecimal?,
    val designerIds: Set<UUID> = emptySet(),
    val publisherIds: Set<UUID> = emptySet(),
)
