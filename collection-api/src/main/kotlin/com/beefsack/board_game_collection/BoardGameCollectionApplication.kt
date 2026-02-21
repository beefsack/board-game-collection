package com.beefsack.board_game_collection

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jdbc.repository.config.EnableJdbcAuditing

@SpringBootApplication
@EnableJdbcAuditing
class BoardGameCollectionApplication

fun main(args: Array<String>) {
	runApplication<BoardGameCollectionApplication>(*args)
}
