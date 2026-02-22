package com.beefsack.board_game_collection.dto

import com.beefsack.board_game_collection.domain.BoardGame
import java.time.Instant
import java.util.UUID

data class PublisherResponse(
    val id: UUID?,
    val name: String?,
    val gameCount: Int = 0,
    val topGames: List<BoardGame> = emptyList(),
    val createdAt: Instant?,
    val updatedAt: Instant?,
)
