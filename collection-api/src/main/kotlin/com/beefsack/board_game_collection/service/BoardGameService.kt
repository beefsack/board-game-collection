package com.beefsack.board_game_collection.service

import com.beefsack.board_game_collection.domain.BoardGame
import com.beefsack.board_game_collection.domain.BoardGameDesigner
import com.beefsack.board_game_collection.domain.BoardGamePublisher
import com.beefsack.board_game_collection.dto.BoardGameRequest
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
    fun findAll(): List<BoardGame> = repo.findAll()

    @Transactional(readOnly = true)
    fun findById(id: UUID): BoardGame =
        repo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

    fun create(request: BoardGameRequest): BoardGame = repo.save(request.toBoardGame())

    fun update(id: UUID, request: BoardGameRequest): BoardGame =
        repo.save(findById(id).copy(
            title = request.title,
            yearPublished = request.yearPublished,
            minPlayers = request.minPlayers,
            maxPlayers = request.maxPlayers,
            playTimeMinutes = request.playTimeMinutes,
            weight = request.weight,
            designers = request.designerIds.map { BoardGameDesigner(it) }.toSet(),
            publishers = request.publisherIds.map { BoardGamePublisher(it) }.toSet(),
        ))

    fun delete(id: UUID) = repo.deleteById(id)

    private fun BoardGameRequest.toBoardGame() = BoardGame(
        title = title,
        yearPublished = yearPublished,
        minPlayers = minPlayers,
        maxPlayers = maxPlayers,
        playTimeMinutes = playTimeMinutes,
        weight = weight,
        designers = designerIds.map { BoardGameDesigner(it) }.toSet(),
        publishers = publisherIds.map { BoardGamePublisher(it) }.toSet(),
    )
}
