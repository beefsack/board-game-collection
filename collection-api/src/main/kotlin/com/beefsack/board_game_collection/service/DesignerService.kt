package com.beefsack.board_game_collection.service

import com.beefsack.board_game_collection.domain.Designer
import com.beefsack.board_game_collection.dto.BoardGameResponse
import com.beefsack.board_game_collection.dto.DesignerRequest
import com.beefsack.board_game_collection.dto.DesignerResponse
import com.beefsack.board_game_collection.dto.toResponse
import com.beefsack.board_game_collection.repository.BoardGameRepository
import com.beefsack.board_game_collection.repository.DesignerRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Service
@Transactional
class DesignerService(
    private val repo: DesignerRepository,
    private val boardGameRepo: BoardGameRepository,
) {

    @Transactional(readOnly = true)
    fun findAll(): List<DesignerResponse> {
        val counts = repo.countGamesPerDesigner().associate { it.id to it.count }
        val topMappings = repo.findTopGameMappingsPerDesigner()
        val gamesById = boardGameRepo.findAllById(topMappings.map { it.boardGameId }.toSet()).associateBy { it.id!! }
        val topGamesPerDesigner = topMappings.groupBy { it.entityId }
            .mapValues { (_, ms) -> ms.mapNotNull { gamesById[it.boardGameId]?.toResponse() } }
        return repo.findAll().map {
            it.toResponse(counts[it.id] ?: 0, topGamesPerDesigner[it.id] ?: emptyList())
        }
    }

    @Transactional(readOnly = true)
    fun findById(id: UUID): DesignerResponse =
        (repo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND))
            .toResponse(repo.countGamesByDesignerId(id))

    fun create(request: DesignerRequest): DesignerResponse =
        repo.save(Designer(name = request.name)).toResponse(0)

    fun update(id: UUID, request: DesignerRequest): DesignerResponse {
        val saved = repo.save(
            (repo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND))
                .copy(name = request.name)
        )
        return saved.toResponse(repo.countGamesByDesignerId(id))
    }

    fun delete(id: UUID) = repo.deleteById(id)

    private fun Designer.toResponse(gameCount: Int, topGames: List<BoardGameResponse> = emptyList()) = DesignerResponse(
        id = id!!,
        name = name,
        gameCount = gameCount,
        topGames = topGames,
        createdAt = createdAt!!,
        updatedAt = updatedAt!!,
    )
}
