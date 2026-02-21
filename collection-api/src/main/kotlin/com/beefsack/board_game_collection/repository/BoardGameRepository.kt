package com.beefsack.board_game_collection.repository

import com.beefsack.board_game_collection.domain.BoardGame
import org.springframework.data.repository.ListCrudRepository
import java.util.UUID

interface BoardGameRepository : ListCrudRepository<BoardGame, UUID>
