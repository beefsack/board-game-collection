package com.beefsack.board_game_collection.domain

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant
import java.util.UUID

@Table("designers")
data class Designer(
    @Id val id: UUID? = null,
    val name: String,
    @CreatedDate val createdAt: Instant? = null,
    @LastModifiedDate val updatedAt: Instant? = null,
)
