package com.beefsack.board_game_collection.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.S3Configuration as AwsS3Configuration
import software.amazon.awssdk.services.s3.model.NoSuchBucketException
import java.net.URI

private fun publicReadPolicy(bucket: String) = """
    {"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::$bucket/*"]}]}
""".trimIndent()

@Configuration
class MinioConfiguration(
    @Value("\${app.minio.endpoint}") private val endpoint: String,
    @Value("\${app.minio.access-key}") private val accessKey: String,
    @Value("\${app.minio.secret-key}") private val secretKey: String,
    @Value("\${app.minio.bucket}") private val bucket: String,
) {
    @Bean
    fun s3Client(): S3Client {
        val client = S3Client.builder()
            .endpointOverride(URI.create(endpoint))
            .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
            .region(Region.US_EAST_1)
            .serviceConfiguration(AwsS3Configuration.builder().pathStyleAccessEnabled(true).build())
            .build()
        try {
            client.headBucket { it.bucket(bucket) }
        } catch (_: NoSuchBucketException) {
            client.createBucket { it.bucket(bucket) }
        }
        client.putBucketPolicy { it.bucket(bucket).policy(publicReadPolicy(bucket)) }
        return client
    }
}
