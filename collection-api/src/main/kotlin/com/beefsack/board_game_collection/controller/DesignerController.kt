package com.beefsack.board_game_collection.controller

import com.beefsack.board_game_collection.dto.DesignerRequest
import com.beefsack.board_game_collection.dto.DesignerResponse
import com.beefsack.board_game_collection.service.DesignerService
import io.swagger.v3.oas.annotations.Operation
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/designers")
@Validated
class DesignerController(private val service: DesignerService) {

    @GetMapping
    @Operation(operationId = "listDesigners")
    fun getAll(): List<DesignerResponse> = service.findAll()

    @GetMapping("/{id}")
    @Operation(operationId = "getDesigner")
    fun getById(@PathVariable id: UUID): DesignerResponse = service.findById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(operationId = "createDesigner")
    fun create(@Valid @RequestBody request: DesignerRequest): DesignerResponse = service.create(request)

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(operationId = "updateDesigner")
    fun update(@PathVariable id: UUID, @Valid @RequestBody request: DesignerRequest): DesignerResponse =
        service.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(operationId = "deleteDesigner")
    fun delete(@PathVariable id: UUID) = service.delete(id)
}
