package com.beefsack.board_game_collection.repository

import com.beefsack.board_game_collection.domain.User
import org.springframework.data.repository.ListCrudRepository
import java.util.UUID

interface UserRepository : ListCrudRepository<User, UUID> {
    fun findByEmail(email: String): User?
}
