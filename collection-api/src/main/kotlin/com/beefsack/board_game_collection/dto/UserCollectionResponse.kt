package com.beefsack.board_game_collection.dto

import io.swagger.v3.oas.annotations.media.Schema

data class UserCollectionResponse(
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val user: UserResponse,
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED) val collection: List<BoardGameResponse>,
)
