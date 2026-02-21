package com.beefsack.board_game_collection.dto

import com.beefsack.board_game_collection.domain.BoardGame
import com.beefsack.board_game_collection.domain.User

data class UserCollectionResponse(val user: User, val collection: List<BoardGame>)
