package com.beefsack.board_game_collection.repository

import com.beefsack.board_game_collection.domain.UserBoardGame
import com.beefsack.board_game_collection.dto.EntityGameMapping
import com.beefsack.board_game_collection.dto.GameCountResult
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.ListCrudRepository
import java.util.UUID

interface UserBoardGameRepository : ListCrudRepository<UserBoardGame, UUID> {
    fun findByUserId(userId: UUID): List<UserBoardGame>
    fun deleteByUserIdAndBoardGameId(userId: UUID, boardGameId: UUID)

    @Query("SELECT user_id AS id, COUNT(*) AS count FROM user_board_games GROUP BY user_id")
    fun countGroupedByUser(): List<GameCountResult>

    @Query("""
        WITH ranked AS (
            SELECT ubg.user_id AS entity_id, ubg.board_game_id,
                   ROW_NUMBER() OVER (PARTITION BY ubg.user_id ORDER BY bg.rating DESC NULLS LAST) AS rn
            FROM user_board_games ubg
            JOIN board_games bg ON bg.id = ubg.board_game_id
        )
        SELECT entity_id, board_game_id FROM ranked WHERE rn <= 5
    """)
    fun findTopGameMappingsPerUser(): List<EntityGameMapping>
}
