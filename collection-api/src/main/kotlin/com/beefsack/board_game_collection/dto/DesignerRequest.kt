package com.beefsack.board_game_collection.dto

import jakarta.validation.constraints.NotBlank

data class DesignerRequest(@NotBlank val name: String)
