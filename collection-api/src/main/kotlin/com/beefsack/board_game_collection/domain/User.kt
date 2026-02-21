package com.beefsack.board_game_collection.domain

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant
import java.util.UUID

@Table("users")
data class User(
    @Id val id: UUID? = null,
    val email: String,
    val passwordHash: String,
    val role: String,
    @CreatedDate val createdAt: Instant? = null,
    @LastModifiedDate val updatedAt: Instant? = null,
)
