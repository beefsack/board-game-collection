package com.beefsack.board_game_collection.dto

import java.util.UUID

data class CollectionEntryRequest(val boardGameId: UUID, val condition: String?)
