package com.beefsack.board_game_collection.service

import com.beefsack.board_game_collection.domain.BoardGame
import com.beefsack.board_game_collection.domain.User
import com.beefsack.board_game_collection.domain.UserBoardGame
import com.beefsack.board_game_collection.dto.CollectionEntryRequest
import com.beefsack.board_game_collection.dto.UserResponse
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
    fun findAll(): List<UserResponse> = userRepo.findAll().map { it.toResponse() }

    @Transactional(readOnly = true)
    fun findById(id: UUID): UserResponse =
        (userRepo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)).toResponse()

    @Transactional(readOnly = true)
    fun findCollection(userId: UUID): List<BoardGame> =
        boardGameRepo.findAllById(userBoardGameRepo.findByUserId(userId).map { it.boardGameId })

    fun delete(id: UUID) = userRepo.deleteById(id)

    fun addToCollection(userId: UUID, request: CollectionEntryRequest): UserBoardGame =
        userBoardGameRepo.save(
            UserBoardGame(userId = userId, boardGameId = request.boardGameId, condition = request.condition)
        )

    fun removeFromCollection(userId: UUID, boardGameId: UUID) =
        userBoardGameRepo.deleteByUserIdAndBoardGameId(userId, boardGameId)

    private fun User.toResponse() = UserResponse(
        id = id,
        email = email,
        displayName = displayName,
        role = role,
    )
}
