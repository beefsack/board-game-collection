package com.beefsack.board_game_collection.service

import com.beefsack.board_game_collection.domain.Designer
import com.beefsack.board_game_collection.dto.DesignerRequest
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
import java.util.Optional
import java.util.UUID

class DesignerServiceTest {

    private val repo: DesignerRepository = mockk()
    private val service = DesignerService(repo)

    @Test
    fun `findAll returns list from repository`() {
        val designers = listOf(Designer(id = UUID.randomUUID(), name = "Reiner Knizia"))
        every { repo.findAll() } returns designers

        assertEquals(designers, service.findAll())
    }

    @Test
    fun `findById returns designer when found`() {
        val id = UUID.randomUUID()
        val designer = Designer(id = id, name = "Reiner Knizia")
        every { repo.findById(id) } returns Optional.of(designer)

        assertEquals(designer, service.findById(id))
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
        val saved = Designer(id = UUID.randomUUID(), name = "Reiner Knizia")
        every { repo.save(any()) } returns saved

        assertEquals(saved, service.create(DesignerRequest("Reiner Knizia")))
        verify { repo.save(match { it.name == "Reiner Knizia" && it.id == null }) }
    }

    @Test
    fun `update applies new name to existing designer`() {
        val id = UUID.randomUUID()
        val existing = Designer(id = id, name = "Old Name")
        val updated = existing.copy(name = "New Name")
        every { repo.findById(id) } returns Optional.of(existing)
        every { repo.save(updated) } returns updated

        assertEquals(updated, service.update(id, DesignerRequest("New Name")))
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
