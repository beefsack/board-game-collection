package com.beefsack.board_game_collection.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import java.util.UUID

@Service
class ImageService(
    private val s3Client: S3Client,
    @Value("\${app.minio.bucket}") private val bucket: String,
) {
    fun upload(gameId: UUID, file: MultipartFile) {
        s3Client.putObject(
            { it.bucket(bucket).key("$gameId").contentType(file.contentType).contentLength(file.size) },
            RequestBody.fromInputStream(file.inputStream, file.size),
        )
    }
}
