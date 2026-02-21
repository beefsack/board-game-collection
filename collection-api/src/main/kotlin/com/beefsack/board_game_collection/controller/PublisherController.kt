package com.beefsack.board_game_collection.controller

import com.beefsack.board_game_collection.domain.Publisher
import com.beefsack.board_game_collection.dto.PublisherRequest
import com.beefsack.board_game_collection.service.PublisherService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/publishers")
@Validated
class PublisherController(private val service: PublisherService) {

    @GetMapping
    fun getAll(): List<Publisher> = service.findAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): Publisher = service.findById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody request: PublisherRequest): Publisher = service.create(request)

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @Valid @RequestBody request: PublisherRequest): Publisher =
        service.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: UUID) = service.delete(id)
}
