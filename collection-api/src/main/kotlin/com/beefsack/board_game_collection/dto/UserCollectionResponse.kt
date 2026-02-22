package com.beefsack.board_game_collection.dto

import com.beefsack.board_game_collection.domain.BoardGame

data class UserCollectionResponse(val user: UserResponse, val collection: List<BoardGame>)
