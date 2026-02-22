package com.beefsack.board_game_collection.config

import com.nimbusds.jose.jwk.JWKSet
import com.nimbusds.jose.jwk.RSAKey
import com.nimbusds.jose.jwk.source.ImmutableJWKSet
import com.nimbusds.jose.jwk.source.JWKSource
import com.nimbusds.jose.proc.SecurityContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder
import org.springframework.security.web.SecurityFilterChain
import java.security.KeyFactory
import java.security.KeyPairGenerator
import java.security.interfaces.RSAPrivateCrtKey
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.security.spec.PKCS8EncodedKeySpec
import java.security.spec.RSAPublicKeySpec
import java.util.Base64
import java.util.UUID

@Configuration
class SecurityConfiguration {

    @Bean
    fun rsaKey(): RSAKey {
        val pem = System.getenv("JWT_RSA_KEY")
        if (!pem.isNullOrBlank()) {
            // Load stable key from Kubernetes Secret — required for multi-replica deployments.
            // Generate with: openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 | base64 -w0
            // Store as: kubectl create secret generic jwt-rsa-key --from-literal=private-key="$(cat key.pem)"
            val der = Base64.getDecoder().decode(
                pem.replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replace("\\s".toRegex(), "")
            )
            val privateKey = KeyFactory.getInstance("RSA")
                .generatePrivate(PKCS8EncodedKeySpec(der)) as RSAPrivateCrtKey
            val publicKey = KeyFactory.getInstance("RSA")
                .generatePublic(RSAPublicKeySpec(privateKey.modulus, privateKey.publicExponent)) as RSAPublicKey
            return RSAKey.Builder(publicKey).privateKey(privateKey).keyID("production").build()
        }
        // Local dev: ephemeral key pair — tokens are invalidated on restart.
        val kp = KeyPairGenerator.getInstance("RSA").also { it.initialize(2048) }.generateKeyPair()
        return RSAKey.Builder(kp.public as RSAPublicKey)
            .privateKey(kp.private as RSAPrivateKey)
            .keyID(UUID.randomUUID().toString())
            .build()
    }

    @Bean
    fun jwkSource(rsaKey: RSAKey): JWKSource<SecurityContext> = ImmutableJWKSet(JWKSet(rsaKey))

    @Bean
    fun jwtDecoder(rsaKey: RSAKey): JwtDecoder = NimbusJwtDecoder.withPublicKey(rsaKey.toRSAPublicKey()).build()

    @Bean
    fun jwtEncoder(jwkSource: JWKSource<SecurityContext>): JwtEncoder = NimbusJwtEncoder(jwkSource)

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun authenticationManager(userDetailsService: UserDetailsService, passwordEncoder: PasswordEncoder): AuthenticationManager =
        ProviderManager(
            DaoAuthenticationProvider(userDetailsService).apply {
                setPasswordEncoder(passwordEncoder)
            }
        )

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests {
                it.requestMatchers("/api/auth/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/error").permitAll()
                it.anyRequest().authenticated()
            }
            .oauth2ResourceServer { it.jwt { } }
        return http.build()
    }
}
