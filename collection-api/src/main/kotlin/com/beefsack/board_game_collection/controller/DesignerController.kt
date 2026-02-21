package com.beefsack.board_game_collection.controller

import com.beefsack.board_game_collection.domain.Designer
import com.beefsack.board_game_collection.dto.DesignerRequest
import com.beefsack.board_game_collection.service.DesignerService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/designers")
@Validated
class DesignerController(private val service: DesignerService) {

    @GetMapping
    fun getAll(): List<Designer> = service.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): Designer = service.findById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody request: DesignerRequest): Designer = service.create(request)

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @Valid @RequestBody request: DesignerRequest): Designer =
        service.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: UUID) = service.delete(id)
}
