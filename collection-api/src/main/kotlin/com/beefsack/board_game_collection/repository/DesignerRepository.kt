package com.beefsack.board_game_collection.repository

import com.beefsack.board_game_collection.domain.Designer
import org.springframework.data.repository.ListCrudRepository
import java.util.UUID

interface DesignerRepository : ListCrudRepository<Designer, UUID>
