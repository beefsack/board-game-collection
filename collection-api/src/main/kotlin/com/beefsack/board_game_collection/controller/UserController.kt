package com.beefsack.board_game_collection.controller

import com.beefsack.board_game_collection.domain.UserBoardGame
import com.beefsack.board_game_collection.dto.CollectionEntryRequest
import com.beefsack.board_game_collection.dto.UserCollectionResponse
import com.beefsack.board_game_collection.dto.UserResponse
import com.beefsack.board_game_collection.service.UserService
import io.swagger.v3.oas.annotations.Operation
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/users")
@Validated
class UserController(private val service: UserService) {

    @GetMapping
    @Operation(operationId = "listUsers")
    fun getAll(): List<UserResponse> = service.findAll()

    @GetMapping("/{id}")
    @Operation(operationId = "getUser")
    fun getById(@PathVariable id: UUID): UserCollectionResponse {
        val user = service.findById(id)
        val collection = service.findCollection(id)
        return UserCollectionResponse(user, collection)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(operationId = "deleteUser")
    fun delete(@PathVariable id: UUID) = service.delete(id)

    @PostMapping("/{id}/board-games")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN') or #id.toString() == authentication.name")
    @Operation(operationId = "addToCollection")
    fun addToCollection(
        @PathVariable id: UUID,
        @Valid @RequestBody request: CollectionEntryRequest,
    ): UserBoardGame = service.addToCollection(id, request)

    @DeleteMapping("/{id}/board-games/{gameId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN') or #id.toString() == authentication.name")
    @Operation(operationId = "removeFromCollection")
    fun removeFromCollection(@PathVariable id: UUID, @PathVariable gameId: UUID) =
        service.removeFromCollection(id, gameId)
}
