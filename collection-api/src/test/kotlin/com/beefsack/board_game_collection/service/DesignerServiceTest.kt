package com.beefsack.board_game_collection.service

import com.beefsack.board_game_collection.domain.Designer
import com.beefsack.board_game_collection.dto.DesignerRequest
import com.beefsack.board_game_collection.dto.DesignerResponse
import com.beefsack.board_game_collection.repository.BoardGameRepository
import com.beefsack.board_game_collection.repository.DesignerRepository
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.Runs
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import java.time.Instant
import java.util.Optional
import java.util.UUID

class DesignerServiceTest {

    private val repo: DesignerRepository = mockk()
    private val boardGameRepo: BoardGameRepository = mockk()
    private val service = DesignerService(repo, boardGameRepo)

    @Test
    fun `findAll returns list from repository`() {
        val id = UUID.randomUUID()
        val designer = Designer(id = id, name = "Reiner Knizia", createdAt = Instant.EPOCH, updatedAt = Instant.EPOCH)
        every { repo.findAll() } returns listOf(designer)
        every { repo.countGamesPerDesigner() } returns emptyList()
        every { repo.findTopGameMappingsPerDesigner() } returns emptyList()
        every { boardGameRepo.findAllById(emptySet<UUID>()) } returns emptyList()

        val result = service.findAll()
        assertEquals(1, result.size)
        assertEquals(id, result[0].id)
        assertEquals("Reiner Knizia", result[0].name)
        assertEquals(0, result[0].gameCount)
    }

    @Test
    fun `findById returns designer when found`() {
        val id = UUID.randomUUID()
        val designer = Designer(id = id, name = "Reiner Knizia", createdAt = Instant.EPOCH, updatedAt = Instant.EPOCH)
        every { repo.findById(id) } returns Optional.of(designer)
        every { repo.countGamesByDesignerId(id) } returns 3

        val result = service.findById(id)
        assertEquals(DesignerResponse(id = id, name = "Reiner Knizia", gameCount = 3, createdAt = Instant.EPOCH, updatedAt = Instant.EPOCH), result)
    }

    @Test
    fun `findById throws 404 when designer not found`() {
        val id = UUID.randomUUID()
        every { repo.findById(id) } returns Optional.empty()

        val ex = assertThrows<ResponseStatusException> { service.findById(id) }
        assertEquals(HttpStatus.NOT_FOUND.value(), ex.statusCode.value())
    }

    @Test
    fun `create saves and returns new designer`() {
        val saved = Designer(id = UUID.randomUUID(), name = "Reiner Knizia", createdAt = Instant.EPOCH, updatedAt = Instant.EPOCH)
        every { repo.save(any()) } returns saved

        val result = service.create(DesignerRequest("Reiner Knizia"))
        assertEquals(saved.id, result.id)
        assertEquals("Reiner Knizia", result.name)
        assertEquals(0, result.gameCount)
        verify { repo.save(match { it.name == "Reiner Knizia" && it.id == null }) }
    }

    @Test
    fun `update applies new name to existing designer`() {
        val id = UUID.randomUUID()
        val existing = Designer(id = id, name = "Old Name", createdAt = Instant.EPOCH, updatedAt = Instant.EPOCH)
        val updated = existing.copy(name = "New Name")
        every { repo.findById(id) } returns Optional.of(existing)
        every { repo.save(updated) } returns updated
        every { repo.countGamesByDesignerId(id) } returns 2

        val result = service.update(id, DesignerRequest("New Name"))
        assertEquals("New Name", result.name)
        assertEquals(2, result.gameCount)
        verify { repo.save(updated) }
    }

    @Test
    fun `delete calls deleteById on repository`() {
        val id = UUID.randomUUID()
        every { repo.deleteById(id) } just Runs

        service.delete(id)

        verify { repo.deleteById(id) }
    }
}
