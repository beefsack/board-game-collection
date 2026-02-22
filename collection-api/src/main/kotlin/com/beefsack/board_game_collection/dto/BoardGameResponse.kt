package com.beefsack.board_game_collection.dto

import com.beefsack.board_game_collection.domain.BoardGame
import io.swagger.v3.oas.annotations.media.Schema
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Schema(name = "BoardGame")
data class BoardGameResponse(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val id: UUID,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val title: String,
    val yearPublished: Int?,
    val minPlayers: Int?,
    val maxPlayers: Int?,
    val minPlayTimeMinutes: Int?,
    val maxPlayTimeMinutes: Int?,
    val weight: BigDecimal?,
    val rating: BigDecimal?,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val hasImage: Boolean,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val designerIds: Set<UUID>,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val publisherIds: Set<UUID>,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val createdAt: Instant,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val updatedAt: Instant,
)

fun BoardGame.toResponse() = BoardGameResponse(
    id = id!!,
    title = title,
    yearPublished = yearPublished,
    minPlayers = minPlayers,
    maxPlayers = maxPlayers,
    minPlayTimeMinutes = minPlayTimeMinutes,
    maxPlayTimeMinutes = maxPlayTimeMinutes,
    weight = weight,
    rating = rating,
    hasImage = hasImage,
    designerIds = designers.map { it.designerId }.toSet(),
    publisherIds = publishers.map { it.publisherId }.toSet(),
    createdAt = createdAt!!,
    updatedAt = updatedAt!!,
)
