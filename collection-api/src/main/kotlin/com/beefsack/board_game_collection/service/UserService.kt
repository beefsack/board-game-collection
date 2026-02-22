package com.beefsack.board_game_collection.service

import com.beefsack.board_game_collection.domain.User
import com.beefsack.board_game_collection.domain.UserBoardGame
import com.beefsack.board_game_collection.dto.BoardGameResponse
import com.beefsack.board_game_collection.dto.CollectionEntryRequest
import com.beefsack.board_game_collection.dto.UserResponse
import com.beefsack.board_game_collection.dto.toResponse
import com.beefsack.board_game_collection.repository.BoardGameRepository
import com.beefsack.board_game_collection.repository.UserBoardGameRepository
import com.beefsack.board_game_collection.repository.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Service
@Transactional
class UserService(
    private val userRepo: UserRepository,
    private val userBoardGameRepo: UserBoardGameRepository,
    private val boardGameRepo: BoardGameRepository,
) {

    @Transactional(readOnly = true)
    fun findAll(): List<UserResponse> {
        val counts = userBoardGameRepo.countGroupedByUser().associate { it.id to it.count }
        val topMappings = userBoardGameRepo.findTopGameMappingsPerUser()
        val gamesById = boardGameRepo.findAllById(topMappings.map { it.boardGameId }.toSet()).associateBy { it.id!! }
        val topGamesPerUser = topMappings.groupBy { it.entityId }
            .mapValues { (_, ms) -> ms.mapNotNull { gamesById[it.boardGameId]?.toResponse() } }
        return userRepo.findAll().map {
            it.toResponse(counts[it.id] ?: 0, topGamesPerUser[it.id] ?: emptyList())
        }
    }

    @Transactional(readOnly = true)
    fun findById(id: UUID): UserResponse =
        (userRepo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)).toResponse()

    @Transactional(readOnly = true)
    fun findCollection(userId: UUID): List<BoardGameResponse> =
        boardGameRepo.findAllById(userBoardGameRepo.findByUserId(userId).map { it.boardGameId }).map { it.toResponse() }

    fun delete(id: UUID) = userRepo.deleteById(id)

    fun addToCollection(userId: UUID, request: CollectionEntryRequest): UserBoardGame =
        userBoardGameRepo.save(
            UserBoardGame(userId = userId, boardGameId = request.boardGameId, condition = request.condition)
        )

    fun removeFromCollection(userId: UUID, boardGameId: UUID) =
        userBoardGameRepo.deleteByUserIdAndBoardGameId(userId, boardGameId)

    private fun User.toResponse(gameCount: Int = 0, topGames: List<BoardGameResponse> = emptyList()) = UserResponse(
        id = id!!,
        email = email,
        displayName = displayName,
        role = role,
        gameCount = gameCount,
        topGames = topGames,
    )
}
