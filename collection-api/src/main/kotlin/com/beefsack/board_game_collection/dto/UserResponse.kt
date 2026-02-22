package com.beefsack.board_game_collection.dto

import com.beefsack.board_game_collection.domain.BoardGame
import java.util.UUID

data class UserResponse(
    val id: UUID?,
    val email: String,
    val displayName: String,
    val role: String,
    val gameCount: Int = 0,
    val topGames: List<BoardGame> = emptyList(),
)
