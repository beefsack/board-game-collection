package com.beefsack.board_game_collection.repository

import com.beefsack.board_game_collection.domain.Publisher
import org.springframework.data.repository.ListCrudRepository
import java.util.UUID

interface PublisherRepository : ListCrudRepository<Publisher, UUID>
