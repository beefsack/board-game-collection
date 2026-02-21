package com.beefsack.board_game_collection.security

import com.beefsack.board_game_collection.repository.UserRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(private val userRepo: UserRepository) : UserDetailsService {

    override fun loadUserByUsername(email: String): UserDetails =
        userRepo.findByEmail(email)?.let { user ->
            User.withUsername(user.email)
                .password(user.passwordHash)
                .roles(user.role)
                .build()
        } ?: throw UsernameNotFoundException(email)
}
