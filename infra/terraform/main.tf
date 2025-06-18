resource "aws_s3_bucket" "data" {
  bucket = "${var.project_name}-data"
  force_destroy = true
}

resource "aws_db_instance" "postgres" {
  identifier         = "${var.project_name}-db"
  engine             = "postgres"
  instance_class     = "db.t3.micro"
  allocated_storage  = 20
  username           = "postgres"
  password           = "changeme123"
  skip_final_snapshot = true
}
