package com.beefsack.board_game_collection.controller

import com.beefsack.board_game_collection.domain.BoardGame
import com.beefsack.board_game_collection.dto.BoardGameRequest
import com.beefsack.board_game_collection.service.BoardGameService
import com.beefsack.board_game_collection.service.ImageService
import io.swagger.v3.oas.annotations.Operation
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@RestController
@RequestMapping("/api/board-games")
@Validated
class BoardGameController(
    private val service: BoardGameService,
    private val imageService: ImageService,
) {

    @GetMapping
    @Operation(operationId = "listBoardGames")
    fun getAll(): List<BoardGame> = service.findAll()

    @GetMapping("/{id}")
    @Operation(operationId = "getBoardGame")
    fun getById(@PathVariable id: UUID): BoardGame = service.findById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(operationId = "createBoardGame")
    fun create(@Valid @RequestBody request: BoardGameRequest): BoardGame = service.create(request)

    @PutMapping("/{id}")
    @Operation(operationId = "updateBoardGame")
    fun update(@PathVariable id: UUID, @Valid @RequestBody request: BoardGameRequest): BoardGame =
        service.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(operationId = "deleteBoardGame")
    fun delete(@PathVariable id: UUID) = service.delete(id)

    @PostMapping("/{id}/image", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(operationId = "uploadBoardGameImage")
    fun uploadImage(@PathVariable id: UUID, @RequestParam("file") file: MultipartFile) {
        imageService.upload(id, file)
        service.markHasImage(id)
    }
}
