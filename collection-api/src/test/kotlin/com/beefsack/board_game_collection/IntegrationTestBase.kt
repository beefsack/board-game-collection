package com.beefsack.board_game_collection

import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.context.WebApplicationContext
import org.testcontainers.containers.GenericContainer
import org.testcontainers.containers.PostgreSQLContainer

@SpringBootTest
@Transactional
abstract class IntegrationTestBase {

    @Autowired
    private lateinit var wac: WebApplicationContext

    lateinit var mockMvc: MockMvc

    @BeforeEach
    fun setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
            .apply<DefaultMockMvcBuilder>(springSecurity())
            .build()
    }

    companion object {
        // Singleton: one container shared across all test classes extending this base.
        // Spring caches the application context because the datasource URL never changes.
        private val postgres: PostgreSQLContainer<*> =
            PostgreSQLContainer("postgres:17").also { it.start() }

        private val minio: GenericContainer<*> =
            GenericContainer("minio/minio")
                .withEnv("MINIO_ROOT_USER", "minioadmin")
                .withEnv("MINIO_ROOT_PASSWORD", "minioadmin")
                .withCommand("server /data")
                .withExposedPorts(9000)
                .also { it.start() }

        @DynamicPropertySource
        @JvmStatic
        fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url") { postgres.jdbcUrl }
            registry.add("spring.datasource.username") { postgres.username }
            registry.add("spring.datasource.password") { postgres.password }
            registry.add("app.minio.endpoint") { "http://${minio.host}:${minio.getMappedPort(9000)}" }
            registry.add("app.minio.access-key") { "minioadmin" }
            registry.add("app.minio.secret-key") { "minioadmin" }
            registry.add("app.minio.bucket") { "board-games" }
        }
    }
}
