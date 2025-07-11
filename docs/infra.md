# Infra Setup for AI FinOps Platform

## 📁 Structure

```bash
infra/
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── providers.tf
└── helm/
    └── ai-finops-chart/
        ├── Chart.yaml
        ├── values.yaml
        ├── templates/
        │   ├── app-deployment.yaml
        │   ├── app-service.yaml
        │   └── app-ingress.yaml
        │   ├── frontend-deployment.yaml
        │   ├── frontend-service.yaml
        │   └── frontend-ingress.yaml
```

---

## 🧱 Terraform (provisioning)

### `providers.tf`

```hcl
provider "aws" {
  region = var.aws_region
}
```

### `variables.tf`

```hcl
variable "aws_region" {
  description = "AWS region"
  default     = "eu-central-1"
}

variable "project_name" {
  description = "AI FinOps Platform"
  default     = "ai-finops-platform"
}
```

### `main.tf`

```hcl
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
```

### `outputs.tf`

```hcl
output "s3_bucket_name" {
  value = aws_s3_bucket.data.bucket
}

output "db_endpoint" {
  value = aws_db_instance.postgres.endpoint
}
```

---

## 🚀 Helm Chart: `helm/ai-finops-chart`

### `Chart.yaml`

```yaml
apiVersion: v2
name: ai-finops-platform
description: A Helm chart for deploying the AI FinOps Platform
type: application
version: 0.1.0
appVersion: "0.1.0"
```

### `values.yaml`

```yaml
image:
  repository: ghcr.io/impesud/ai-finops-platform-app
  tag: ""
  pullPolicy: IfNotPresent

frontendImage:
  repository: ghcr.io/impesud/ai-finops-platform-frontend
  tag: ""
  pullPolicy: IfNotPresent

service:
  type: NodePort
  port: 8000
  nodePort: 30080

frontendService:
  type: NodePort
  port: 3000
  nodePort: 30081
```

### `templates`

All other files in the template folder (deployment, ingress and service)
have been split into app and frontend for greater compatibility and modularity.
