package com.beefsack.board_game_collection

import com.beefsack.board_game_collection.dto.LoginRequest
import com.beefsack.board_game_collection.dto.RegisterRequest
import tools.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class AuthIntegrationTest : IntegrationTestBase() {

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    private fun registerAndGetToken(email: String = "user@example.com"): String {
        val result = mockMvc.perform(
            post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(RegisterRequest(email, "password123")))
        ).andExpect(status().isCreated).andReturn()
        return objectMapper.readTree(result.response.contentAsByteArray)["token"].asText()
    }

    @Test
    fun `register returns 201 with JWT token`() {
        mockMvc.perform(
            post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(RegisterRequest("alice@example.com", "password123")))
        )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.token").isNotEmpty)
    }

    @Test
    fun `register with duplicate email returns 409`() {
        val body = objectMapper.writeValueAsString(RegisterRequest("alice@example.com", "password123"))
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
            .andExpect(status().isConflict)
    }

    @Test
    fun `register with invalid email returns 400`() {
        mockMvc.perform(
            post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(RegisterRequest("not-an-email", "password123")))
        ).andExpect(status().isBadRequest)
    }

    @Test
    fun `register with short password returns 400`() {
        mockMvc.perform(
            post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(RegisterRequest("alice@example.com", "short")))
        ).andExpect(status().isBadRequest)
    }

    @Test
    fun `login with correct credentials returns JWT`() {
        registerAndGetToken("alice@example.com")

        mockMvc.perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(LoginRequest("alice@example.com", "password123")))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.token").isNotEmpty)
    }

    @Test
    fun `login with wrong password returns 401`() {
        registerAndGetToken("alice@example.com")

        mockMvc.perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(LoginRequest("alice@example.com", "wrongpassword")))
        ).andExpect(status().isUnauthorized)
    }

    @Test
    fun `protected endpoint requires authentication`() {
        mockMvc.perform(get("/api/designers"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `protected endpoint is accessible with valid token`() {
        val token = registerAndGetToken()

        mockMvc.perform(
            get("/api/designers")
                .header("Authorization", "Bearer $token")
        ).andExpect(status().isOk)
    }
}
