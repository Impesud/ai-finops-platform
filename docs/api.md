## API Endpoints Documentation

FastAPI service now exposes three separate endpoints for each cloud provider under `/api/v1/costs`.

### AWS Endpoint

```
GET /api/v1/costs/aws
```

**Query Parameters (all optional):**

- `service` (string): e.g. `AmazonEC2`
- `account_id` (string): AWS account ID
- `start_date` (YYYY-MM-DD)
- `end_date` (YYYY-MM-DD)

**Usage Examples:**

**Without filters** (returns all AWS cost records):

```bash
curl "http://localhost:8000/api/v1/costs/aws"
```

**With filters:**

```bash
curl "http://localhost:8000/api/v1/costs/aws?service=AmazonS3&start_date=2025-06-01&end_date=2025-06-30"
```

---

### Azure Endpoint

```
GET /api/v1/costs/azure
```

**Query Parameters (all optional):**

- `service` (string): e.g. `Virtual Machines`
- `account_id` (string): Azure subscription ID
- `start_date` (YYYY-MM-DD)
- `end_date` (YYYY-MM-DD)

**Usage Examples:**

**Without filters:**

```bash
curl "http://localhost:8000/api/v1/costs/azure"
```

**With filters:**

```bash
curl "http://localhost:8000/api/v1/costs/azure?start_date=2025-05-01&end_date=2025-05-31"
```

---

### GCP Endpoint

```
GET /api/v1/costs/gcp
```

**Query Parameters (all optional):**

- `service` (string): e.g. `Compute Engine`
- `account_id` (string): GCP project ID
- `start_date` (YYYY-MM-DD)
- `end_date` (YYYY-MM-DD)

**Usage Examples:**

**Without filters:**

```bash
curl "http://localhost:8000/api/v1/costs/gcp"
```

**With filters:**

```bash
curl "http://localhost:8000/api/v1/costs/gcp?account_id=impesud-1336&start_date=2025-04-01&end_date=2025-04-30"
```

---

## Documentation UIs (Swagger UI and ReDoc)

**Backend Swagger UI** is available at:

```
http://localhost:8000/docs
```

**Backend ReDoc** is available at:

```
http://localhost:8000/redoc
```

**Frontend integration** via Next.js proxy:

```
http://localhost:3000/docs    # Swagger UI
http://localhost:3000/redocs  # ReDoc
```

Make sure your frontend `next.config.ts` includes these rewrites:

```ts
const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : process.env.NEXT_PUBLIC_API_URL!;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE}/api/:path*`,
      },
    ];
  },
};
```

---

*Last updated: July 2025*