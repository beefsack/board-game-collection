package com.beefsack.board_game_collection.repository

import com.beefsack.board_game_collection.domain.UserBoardGame
import org.springframework.data.repository.ListCrudRepository
import java.util.UUID

interface UserBoardGameRepository : ListCrudRepository<UserBoardGame, UUID> {
    fun findByUserId(userId: UUID): List<UserBoardGame>
    fun deleteByUserIdAndBoardGameId(userId: UUID, boardGameId: UUID)
}
