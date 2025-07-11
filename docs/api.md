# API Endpoints Documentation

FastAPI exposes three endpoints under `/api/v1/costs` for AWS, Azure, and GCP.

## AWS Endpoint

```http
GET /api/v1/costs/aws
```

**Query parameters (optional):**

- `service` (string) e.g. `AmazonEC2`
- `account_id` (string) AWS account ID
- `start_date` (YYYY-MM-DD)
- `end_date` (YYYY-MM-DD)

### Examples

Without filters (all AWS costs):

```bash
curl \
  "http://localhost:8000/api/v1/costs/aws"
```

With filters:

```bash
curl \
  "http://localhost:8000/api/v1/costs/aws?service=AmazonS3&\
start_date=2025-06-01&end_date=2025-06-30"
```

---

## Azure Endpoint

```http
GET /api/v1/costs/azure
```

**Query parameters (optional):**

- `service` (string) e.g. `Virtual Machines`
- `account_id` (string) Azure subscription ID
- `start_date` (YYYY-MM-DD)
- `end_date` (YYYY-MM-DD)

### Examples Azure Endpoint

```bash
curl \
  "http://localhost:8000/api/v1/costs/azure"
```

```bash
curl \
  "http://localhost:8000/api/v1/costs/azure?\
start_date=2025-05-01&end_date=2025-05-31"
```

---

## GCP Endpoint

```http
GET /api/v1/costs/gcp
```

**Query parameters (optional):**

- `service` (string) e.g. `Compute Engine`
- `account_id` (string) GCP project ID
- `start_date` (YYYY-MM-DD)
- `end_date` (YYYY-MM-DD)

### Examples GCP Endpoint

```bash
curl \
  "http://localhost:8000/api/v1/costs/gcp"
```

```bash
curl \
  "http://localhost:8000/api/v1/costs/gcp?\
account_id=impesud-1336&start_date=2025-04-01&end_date=2025-04-30"
```

---

## Documentation UIs

**Swagger UI (backend):**

```http
http://localhost:8000/docs
```

**ReDoc (backend):**

```http
http://localhost:8000/redoc
```

**Next.js proxy (frontend):**

```http
http://localhost:3000/docs
http://localhost:3000/redocs
```

### Next.js rewrites (`next.config.ts`)

```ts
async rewrites() {
  return [
    { source: '/api/:path*',    destination: `${API_BASE}/api/:path*` },
    { source: '/docs/:path*',   destination: `${API_BASE}/docs/:path*` },
    { source: '/redocs/:path*', destination: `${API_BASE}/redoc/:path*` },
  ];
}
```

Ensure:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Change Log

Last updated: July 2025
