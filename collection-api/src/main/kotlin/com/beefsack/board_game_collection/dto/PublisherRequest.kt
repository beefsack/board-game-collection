package com.beefsack.board_game_collection.dto

import jakarta.validation.constraints.NotBlank

data class PublisherRequest(@NotBlank val name: String)
