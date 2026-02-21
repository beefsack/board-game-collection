package com.beefsack.board_game_collection.service

import com.beefsack.board_game_collection.domain.Designer
import com.beefsack.board_game_collection.dto.DesignerRequest
import com.beefsack.board_game_collection.repository.DesignerRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Service
@Transactional
class DesignerService(private val repo: DesignerRepository) {

    @Transactional(readOnly = true)
    fun findAll(): List<Designer> = repo.findAll()

    @Transactional(readOnly = true)
    fun findById(id: UUID): Designer =
        repo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

    fun create(request: DesignerRequest): Designer = repo.save(Designer(name = request.name))

    fun update(id: UUID, request: DesignerRequest): Designer =
        repo.save(findById(id).copy(name = request.name))

    fun delete(id: UUID) = repo.deleteById(id)
}
