package com.beefsack.board_game_collection.controller

import com.beefsack.board_game_collection.domain.BoardGame
import com.beefsack.board_game_collection.dto.BoardGameRequest
import com.beefsack.board_game_collection.service.BoardGameService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/board-games")
@Validated
class BoardGameController(private val service: BoardGameService) {

    @GetMapping
    fun getAll(): List<BoardGame> = service.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): BoardGame = service.findById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody request: BoardGameRequest): BoardGame = service.create(request)

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @Valid @RequestBody request: BoardGameRequest): BoardGame =
        service.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: UUID) = service.delete(id)
}
