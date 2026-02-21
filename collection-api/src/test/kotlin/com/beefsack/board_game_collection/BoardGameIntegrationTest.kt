package com.beefsack.board_game_collection

import com.beefsack.board_game_collection.dto.BoardGameRequest
import com.beefsack.board_game_collection.dto.RegisterRequest
import tools.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.math.BigDecimal

class BoardGameIntegrationTest : IntegrationTestBase() {

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    private fun token(): String {
        val result = mockMvc.perform(
            post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(RegisterRequest("gamer@example.com", "password123")))
        ).andReturn()
        return objectMapper.readTree(result.response.contentAsByteArray)["token"].asText()
    }

    private fun createGame(token: String, title: String = "Lost Cities"): String {
        val result = mockMvc.perform(
            post("/api/board-games")
                .header("Authorization", "Bearer $token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                    BoardGameRequest(
                        title = title,
                        yearPublished = 1999,
                        minPlayers = 2,
                        maxPlayers = 2,
                        playTimeMinutes = 30,
                        weight = BigDecimal("2.05"),
                    )
                ))
        ).andExpect(status().isCreated).andReturn()
        return objectMapper.readTree(result.response.contentAsByteArray)["id"].asText()
    }

    @Test
    fun `GET board games without token returns 401`() {
        mockMvc.perform(get("/api/board-games"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `can create and retrieve a board game`() {
        val token = token()
        val id = createGame(token)

        mockMvc.perform(
            get("/api/board-games/$id")
                .header("Authorization", "Bearer $token")
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(id))
            .andExpect(jsonPath("$.title").value("Lost Cities"))
            .andExpect(jsonPath("$.yearPublished").value(1999))
    }

    @Test
    fun `update changes board game fields`() {
        val token = token()
        val id = createGame(token)

        mockMvc.perform(
            put("/api/board-games/$id")
                .header("Authorization", "Bearer $token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                    BoardGameRequest(
                        title = "Lost Cities",
                        yearPublished = 1999,
                        minPlayers = 2,
                        maxPlayers = 2,
                        playTimeMinutes = 60,
                        weight = BigDecimal("2.05"),
                    )
                ))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.playTimeMinutes").value(60))
    }

    @Test
    fun `delete removes board game`() {
        val token = token()
        val id = createGame(token)

        mockMvc.perform(
            delete("/api/board-games/$id")
                .header("Authorization", "Bearer $token")
        ).andExpect(status().isNoContent)

        mockMvc.perform(
            get("/api/board-games/$id")
                .header("Authorization", "Bearer $token")
        ).andExpect(status().isNotFound)
    }

    @Test
    fun `GET by unknown id returns 404`() {
        val token = token()

        mockMvc.perform(
            get("/api/board-games/00000000-0000-0000-0000-000000000000")
                .header("Authorization", "Bearer $token")
        ).andExpect(status().isNotFound)
    }
}
