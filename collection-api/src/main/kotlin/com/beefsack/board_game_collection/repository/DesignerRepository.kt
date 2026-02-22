package com.beefsack.board_game_collection.repository

import com.beefsack.board_game_collection.domain.Designer
import com.beefsack.board_game_collection.dto.GameCountResult
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.ListCrudRepository
import java.util.UUID

interface DesignerRepository : ListCrudRepository<Designer, UUID> {

    @Query("SELECT designer_id AS id, COUNT(*) AS count FROM board_game_designers GROUP BY designer_id")
    fun countGamesPerDesigner(): List<GameCountResult>

    @Query("SELECT COUNT(*) FROM board_game_designers WHERE designer_id = :id")
    fun countGamesByDesignerId(id: UUID): Int
}
