package com.beefsack.board_game_collection.domain

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.relational.core.mapping.MappedCollection
import org.springframework.data.relational.core.mapping.Table
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Table("board_games")
data class BoardGame(
    @Id val id: UUID? = null,
    val title: String,
    val yearPublished: Int?,
    val minPlayers: Int?,
    val maxPlayers: Int?,
    val playTimeMinutes: Int?,
    val weight: BigDecimal?,
    @MappedCollection(idColumn = "board_game_id") val designers: Set<BoardGameDesigner> = emptySet(),
    @MappedCollection(idColumn = "board_game_id") val publishers: Set<BoardGamePublisher> = emptySet(),
    @CreatedDate val createdAt: Instant? = null,
    @LastModifiedDate val updatedAt: Instant? = null,
)

@Table("board_game_designers")
data class BoardGameDesigner(
    @Id val designerId: UUID,
)

@Table("board_game_publishers")
data class BoardGamePublisher(
    @Id val publisherId: UUID,
)
