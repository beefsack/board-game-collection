package com.beefsack.board_game_collection.service

import com.beefsack.board_game_collection.domain.BoardGame
import com.beefsack.board_game_collection.domain.BoardGameDesigner
import com.beefsack.board_game_collection.domain.BoardGamePublisher
import com.beefsack.board_game_collection.dto.BoardGameRequest
import com.beefsack.board_game_collection.dto.BoardGameResponse
import com.beefsack.board_game_collection.dto.toResponse
import com.beefsack.board_game_collection.repository.BoardGameRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Service
@Transactional
class BoardGameService(private val repo: BoardGameRepository) {

    @Transactional(readOnly = true)
    fun findAll(): List<BoardGameResponse> = repo.findAll().map { it.toResponse() }

    @Transactional(readOnly = true)
    fun findById(id: UUID): BoardGameResponse =
        (repo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)).toResponse()

    fun create(request: BoardGameRequest): BoardGameResponse = repo.save(request.toBoardGame()).toResponse()

    fun update(id: UUID, request: BoardGameRequest): BoardGameResponse =
        repo.save((repo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)).copy(
            title = request.title,
            yearPublished = request.yearPublished,
            minPlayers = request.minPlayers,
            maxPlayers = request.maxPlayers,
            minPlayTimeMinutes = request.minPlayTimeMinutes,
            maxPlayTimeMinutes = request.maxPlayTimeMinutes,
            weight = request.weight,
            rating = request.rating,
            designers = request.designerIds.map { BoardGameDesigner(it) }.toSet(),
            publishers = request.publisherIds.map { BoardGamePublisher(it) }.toSet(),
        )).toResponse()

    fun delete(id: UUID) = repo.deleteById(id)

    fun markHasImage(id: UUID) =
        repo.save((repo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)).copy(hasImage = true))

    private fun BoardGameRequest.toBoardGame() = BoardGame(
        title = title,
        yearPublished = yearPublished,
        minPlayers = minPlayers,
        maxPlayers = maxPlayers,
        minPlayTimeMinutes = minPlayTimeMinutes,
        maxPlayTimeMinutes = maxPlayTimeMinutes,
        weight = weight,
        rating = rating,
        designers = designerIds.map { BoardGameDesigner(it) }.toSet(),
        publishers = publisherIds.map { BoardGamePublisher(it) }.toSet(),
    )
}
