package com.beefsack.board_game_collection.dto

import jakarta.validation.constraints.NotBlank
import java.math.BigDecimal
import java.util.UUID

data class BoardGameRequest(
    @NotBlank val title: String,
    val yearPublished: Int? = null,
    val minPlayers: Int? = null,
    val maxPlayers: Int? = null,
    val minPlayTimeMinutes: Int? = null,
    val maxPlayTimeMinutes: Int? = null,
    val weight: BigDecimal? = null,
    val rating: BigDecimal? = null,
    val designerIds: Set<UUID> = emptySet(),
    val publisherIds: Set<UUID> = emptySet(),
)
