package com.beefsack.board_game_collection.repository

import com.beefsack.board_game_collection.domain.UserBoardGame
import com.beefsack.board_game_collection.dto.GameCountResult
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.ListCrudRepository
import java.util.UUID

interface UserBoardGameRepository : ListCrudRepository<UserBoardGame, UUID> {
    fun findByUserId(userId: UUID): List<UserBoardGame>
    fun deleteByUserIdAndBoardGameId(userId: UUID, boardGameId: UUID)

    @Query("SELECT user_id AS id, COUNT(*) AS count FROM user_board_games GROUP BY user_id")
    fun countGroupedByUser(): List<GameCountResult>
}
