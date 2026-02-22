package com.beefsack.board_game_collection.controller

import com.beefsack.board_game_collection.domain.Publisher
import com.beefsack.board_game_collection.dto.PublisherRequest
import com.beefsack.board_game_collection.service.PublisherService
import io.swagger.v3.oas.annotations.Operation
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/publishers")
@Validated
class PublisherController(private val service: PublisherService) {

    @GetMapping
    @Operation(operationId = "listPublishers")
    fun getAll(): List<Publisher> = service.findAll()

    @GetMapping("/{id}")
    @Operation(operationId = "getPublisher")
    fun getById(@PathVariable id: UUID): Publisher = service.findById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(operationId = "createPublisher")
    fun create(@Valid @RequestBody request: PublisherRequest): Publisher = service.create(request)

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(operationId = "updatePublisher")
    fun update(@PathVariable id: UUID, @Valid @RequestBody request: PublisherRequest): Publisher =
        service.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(operationId = "deletePublisher")
    fun delete(@PathVariable id: UUID) = service.delete(id)
}
