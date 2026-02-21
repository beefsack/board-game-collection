package com.beefsack.board_game_collection.controller

import com.beefsack.board_game_collection.dto.AuthResponse
import com.beefsack.board_game_collection.dto.LoginRequest
import com.beefsack.board_game_collection.dto.RegisterRequest
import com.beefsack.board_game_collection.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
@Validated
class AuthController(private val service: AuthService) {

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun register(@Valid @RequestBody request: RegisterRequest): AuthResponse = service.register(request)

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): AuthResponse = service.login(request)
}
