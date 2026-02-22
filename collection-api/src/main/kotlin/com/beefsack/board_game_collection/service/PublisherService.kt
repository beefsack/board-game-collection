package com.beefsack.board_game_collection.service

import com.beefsack.board_game_collection.domain.Publisher
import com.beefsack.board_game_collection.dto.BoardGameResponse
import com.beefsack.board_game_collection.dto.PublisherRequest
import com.beefsack.board_game_collection.dto.PublisherResponse
import com.beefsack.board_game_collection.dto.toResponse
import com.beefsack.board_game_collection.repository.BoardGameRepository
import com.beefsack.board_game_collection.repository.PublisherRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Service
@Transactional
class PublisherService(
    private val repo: PublisherRepository,
    private val boardGameRepo: BoardGameRepository,
) {

    @Transactional(readOnly = true)
    fun findAll(): List<PublisherResponse> {
        val counts = repo.countGamesPerPublisher().associate { it.id to it.count }
        val topMappings = repo.findTopGameMappingsPerPublisher()
        val gamesById = boardGameRepo.findAllById(topMappings.map { it.boardGameId }.toSet()).associateBy { it.id!! }
        val topGamesPerPublisher = topMappings.groupBy { it.entityId }
            .mapValues { (_, ms) -> ms.mapNotNull { gamesById[it.boardGameId]?.toResponse() } }
        return repo.findAll().map {
            it.toResponse(counts[it.id] ?: 0, topGamesPerPublisher[it.id] ?: emptyList())
        }
    }

    @Transactional(readOnly = true)
    fun findById(id: UUID): PublisherResponse =
        (repo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND))
            .toResponse(repo.countGamesByPublisherId(id))

    fun create(request: PublisherRequest): PublisherResponse =
        repo.save(Publisher(name = request.name)).toResponse(0)

    fun update(id: UUID, request: PublisherRequest): PublisherResponse {
        val saved = repo.save(
            (repo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND))
                .copy(name = request.name)
        )
        return saved.toResponse(repo.countGamesByPublisherId(id))
    }

    fun delete(id: UUID) = repo.deleteById(id)

    private fun Publisher.toResponse(gameCount: Int, topGames: List<BoardGameResponse> = emptyList()) = PublisherResponse(
        id = id!!,
        name = name,
        gameCount = gameCount,
        topGames = topGames,
        createdAt = createdAt!!,
        updatedAt = updatedAt!!,
    )
}
