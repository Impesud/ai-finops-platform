output "s3_bucket_name" {
  value = aws_s3_bucket.data.bucket
}

output "db_endpoint" {
  value = aws_db_instance.postgres.endpoint
}