package com.beefsack.board_game_collection.repository

import com.beefsack.board_game_collection.domain.Designer
import com.beefsack.board_game_collection.dto.EntityGameMapping
import com.beefsack.board_game_collection.dto.GameCountResult
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.ListCrudRepository
import java.util.UUID

interface DesignerRepository : ListCrudRepository<Designer, UUID> {

    @Query("SELECT designer_id AS id, COUNT(*) AS count FROM board_game_designers GROUP BY designer_id")
    fun countGamesPerDesigner(): List<GameCountResult>

    @Query("SELECT COUNT(*) FROM board_game_designers WHERE designer_id = :id")
    fun countGamesByDesignerId(id: UUID): Int

    @Query("""
        WITH ranked AS (
            SELECT bgd.designer_id AS entity_id, bgd.board_game_id,
                   ROW_NUMBER() OVER (PARTITION BY bgd.designer_id ORDER BY bg.rating DESC NULLS LAST) AS rn
            FROM board_game_designers bgd
            JOIN board_games bg ON bg.id = bgd.board_game_id
        )
        SELECT entity_id, board_game_id FROM ranked WHERE rn <= 5
    """)
    fun findTopGameMappingsPerDesigner(): List<EntityGameMapping>
}
