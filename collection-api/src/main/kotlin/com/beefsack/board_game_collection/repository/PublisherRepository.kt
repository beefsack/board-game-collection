package com.beefsack.board_game_collection.repository

import com.beefsack.board_game_collection.domain.Publisher
import com.beefsack.board_game_collection.dto.EntityGameMapping
import com.beefsack.board_game_collection.dto.GameCountResult
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.ListCrudRepository
import java.util.UUID

interface PublisherRepository : ListCrudRepository<Publisher, UUID> {

    @Query("SELECT publisher_id AS id, COUNT(*) AS count FROM board_game_publishers GROUP BY publisher_id")
    fun countGamesPerPublisher(): List<GameCountResult>

    @Query("SELECT COUNT(*) FROM board_game_publishers WHERE publisher_id = :id")
    fun countGamesByPublisherId(id: UUID): Int

    @Query("""
        WITH ranked AS (
            SELECT bgp.publisher_id AS entity_id, bgp.board_game_id,
                   ROW_NUMBER() OVER (PARTITION BY bgp.publisher_id ORDER BY bg.rating DESC NULLS LAST) AS rn
            FROM board_game_publishers bgp
            JOIN board_games bg ON bg.id = bgp.board_game_id
        )
        SELECT entity_id, board_game_id FROM ranked WHERE rn <= 5
    """)
    fun findTopGameMappingsPerPublisher(): List<EntityGameMapping>
}
