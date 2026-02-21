package com.beefsack.board_game_collection.service

import com.beefsack.board_game_collection.domain.User
import com.beefsack.board_game_collection.dto.AuthResponse
import com.beefsack.board_game_collection.dto.LoginRequest
import com.beefsack.board_game_collection.dto.RegisterRequest
import com.beefsack.board_game_collection.repository.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.AuthenticationException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.Instant
import java.time.temporal.ChronoUnit

@Service
@Transactional
class AuthService(
    private val userRepo: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authManager: AuthenticationManager,
    private val jwtEncoder: JwtEncoder,
) {

    fun register(request: RegisterRequest): AuthResponse {
        if (userRepo.findByEmail(request.email) != null) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Email already registered")
        }
        val user = userRepo.save(
            User(
                email = request.email,
                passwordHash = passwordEncoder.encode(request.password)!!,
                role = "USER",
            )
        )
        return AuthResponse(generateToken(user.email))
    }

    @Transactional(readOnly = true)
    fun login(request: LoginRequest): AuthResponse {
        try {
            authManager.authenticate(UsernamePasswordAuthenticationToken(request.email, request.password))
        } catch (e: AuthenticationException) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials")
        }
        return AuthResponse(generateToken(request.email))
    }

    private fun generateToken(email: String): String {
        val now = Instant.now()
        val claims = JwtClaimsSet.builder()
            .issuer("board-game-collection")
            .issuedAt(now)
            .expiresAt(now.plus(1, ChronoUnit.HOURS))
            .subject(email)
            .build()
        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).tokenValue
    }
}
