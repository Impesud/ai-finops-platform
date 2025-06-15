# Infra Setup for AI FinOps Platform

## 📁 Structure
```
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
        │   ├── deployment.yaml
        │   ├── service.yaml
        │   └── ingress.yaml
```

---

## 🧱 Terraform (provisioning)

### `providers.tf`
```hcl
provider "aws" {
  region = var.region
}
```

### `variables.tf`
```hcl
variable "region" {
  default = "eu-west-1"
}

variable "cluster_name" {
  default = "finops-cluster"
}
```

### `main.tf`
```hcl
resource "aws_eks_cluster" "finops" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_cluster.arn
  vpc_config {
    subnet_ids = ["subnet-abc123", "subnet-def456"]
  }
}
```

### `outputs.tf`
```hcl
output "cluster_endpoint" {
  value = aws_eks_cluster.finops.endpoint
}
```

---

## 🚀 Helm Chart: `helm/ai-finops-chart`

### `Chart.yaml`
```yaml
apiVersion: v2
name: ai-finops
version: 0.1.0
```

### `values.yaml`
```yaml
backend:
  image: impesud/finops-backend:latest
  port: 8000

frontend:
  image: impesud/finops-frontend:latest
  port: 3000
```

### `templates/deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-finops
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ai-finops
  template:
    metadata:
      labels:
        app: ai-finops
    spec:
      containers:
        - name: backend
          image: {{ .Values.backend.image }}
          ports:
            - containerPort: {{ .Values.backend.port }}

        - name: frontend
          image: {{ .Values.frontend.image }}
          ports:
            - containerPort: {{ .Values.frontend.port }}
```

### `templates/service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: ai-finops
spec:
  selector:
    app: ai-finops
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
```

### `templates/ingress.yaml`
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ai-finops
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: finops.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ai-finops
                port:
                  number: 80
```
