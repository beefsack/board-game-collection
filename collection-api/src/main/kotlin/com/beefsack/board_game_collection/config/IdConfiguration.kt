package com.beefsack.board_game_collection.config

import com.beefsack.board_game_collection.domain.BoardGame
import com.beefsack.board_game_collection.domain.Designer
import com.beefsack.board_game_collection.domain.Publisher
import com.beefsack.board_game_collection.domain.User
import com.beefsack.board_game_collection.domain.UserBoardGame
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.relational.core.mapping.event.BeforeConvertCallback
import java.util.UUID

@Configuration
class IdConfiguration {

    @Bean
    fun boardGameIdCallback() = BeforeConvertCallback<BoardGame> {
        if (it.id == null) it.copy(id = UUID.randomUUID()) else it
    }

    @Bean
    fun designerIdCallback() = BeforeConvertCallback<Designer> {
        if (it.id == null) it.copy(id = UUID.randomUUID()) else it
    }

    @Bean
    fun publisherIdCallback() = BeforeConvertCallback<Publisher> {
        if (it.id == null) it.copy(id = UUID.randomUUID()) else it
    }

    @Bean
    fun userIdCallback() = BeforeConvertCallback<User> {
        if (it.id == null) it.copy(id = UUID.randomUUID()) else it
    }

    @Bean
    fun userBoardGameIdCallback() = BeforeConvertCallback<UserBoardGame> {
        if (it.id == null) it.copy(id = UUID.randomUUID()) else it
    }
}
