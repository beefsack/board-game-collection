package com.beefsack.board_game_collection.service

import com.beefsack.board_game_collection.domain.Publisher
import com.beefsack.board_game_collection.dto.PublisherRequest
import com.beefsack.board_game_collection.repository.PublisherRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Service
@Transactional
class PublisherService(private val repo: PublisherRepository) {

    @Transactional(readOnly = true)
    fun findAll(): List<Publisher> = repo.findAll()

    @Transactional(readOnly = true)
    fun findById(id: UUID): Publisher =
        repo.findByIdOrNull(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

    fun create(request: PublisherRequest): Publisher = repo.save(Publisher(name = request.name))

    fun update(id: UUID, request: PublisherRequest): Publisher =
        repo.save(findById(id).copy(name = request.name))

    fun delete(id: UUID) = repo.deleteById(id)
}
