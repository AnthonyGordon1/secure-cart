# 🛒 SecureCart

> ⚠️ This app is intentionally vulnerable. Do not deploy it anywhere public or use it in production. It is a local sandbox only.

SecureCart is a deliberately vulnerable e-commerce app I built to tinker with application security concepts. It covers OWASP Top 10, AWS misconfigurations, and Kafka event stream security in a context that feels close to a real financial application. Not bleeding edge, just me learning by doing.

---

## What is in here

- Angular frontend with Angular Material dark theme
- Node/Express backend with SQLite
- Apache Kafka for event streaming
- LocalStack for AWS simulation (S3, IAM, SSM)
- GitHub Actions CI with Semgrep SAST and Gitleaks secrets scanning
- Intentional vulnerabilities with working exploit scripts and verified patches

---

## Getting it running locally

### What you need installed

- Node.js v22+
- Docker Desktop
- AWS CLI (`brew install awscli`)
- Python 3 (`pip3 install awscli-local requests`)

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/AnthonyGordon1/secure-cart.git
cd secure-cart
```

**2. Install dependencies**
```bash
cd backend && npm install
cd ../frontend && npm install
```

**3. Set up your environment file**
```bash
cp .env.example .env
```

**4. Configure AWS CLI for LocalStack**
```bash
aws configure
```
Use these fake values — they are not real credentials:
```
AWS Access Key ID: fake-access-key-1234
AWS Secret Access Key: fake-secret-key-5678
Default region: us-east-1
Output format: json
```

**5. Start Docker Desktop**

Open Docker Desktop and wait for it to fully start before the next step.

**6. Start Kafka and LocalStack**
```bash
docker-compose up zookeeper kafka localstack
```
Wait until you see `LocalStack resources initialized.` in the logs.

**7. Start the backend**
```bash
cd backend
npm run dev
```

**8. Start the frontend**
```bash
cd frontend
npm start
```

**9. Verify everything is up**

- Frontend: http://localhost:4200
- Backend health check: http://localhost:3000/health
- S3 bucket: `aws --endpoint-url=http://localhost:4566 s3 ls`

---

## Vulnerability Index

Each vulnerability lives on a `vuln/` branch with a working exploit script. The corresponding `patch/` branch contains the fix and verification that the exploit fails. Full write-ups with CVSS scores, root cause analysis, and real-world context live in `docs/vulnerabilities/`.

| # | Vulnerability | Category | CVSS | Status |
| --- | --- | --- | --- | --- |
| 1 | JWT alg:none Bypass | Broken Auth | 9.1 | ✅ [Write-up](docs/vulnerabilities/jwt-vulnerabilities.md) |
| 2 | JWT Weak Secret | Broken Auth | 8.8 | ✅ [Write-up](docs/vulnerabilities/jwt-vulnerabilities.md) |
| 3 | SQL Injection | Injection | 9.8 | Coming Soon |
| 4 | Broken Access Control / IDOR | Access Control | 8.1 | Coming Soon |
| 5 | Stored XSS | XSS | 8.0 | Coming Soon |
| 6 | Excessive Data Exposure | API Security | 7.5 | Coming Soon |
| 7 | Hardcoded Secrets | Security Misconfiguration | 9.1 | Coming Soon |
| 8 | Unauthenticated Kafka Broker | Kafka Security | 9.3 | Coming Soon |
| 9 | PII in Plaintext Kafka Events | Kafka Security | 7.5 | Coming Soon |
| 10 | Kafka Consumer Injection | Kafka / Injection | 9.0 | Coming Soon |
| 11 | Overly Permissive IAM Role | Cloud Security | 9.8 | Coming Soon |
| 12 | Public S3 Bucket | Cloud Security | 8.6 | Coming Soon |

---

## Running exploit scripts

Make sure the backend is running before executing any exploit scripts.
```bash
# JWT alg:none bypass
python3 docs/exploits/jwt-alg-none.py

# JWT weak secret brute force
python3 docs/exploits/jwt-brute-force.py
```

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Angular 21, Angular Material, TypeScript, RxJS |
| Backend | Node.js, Express, SQLite |
| Event Streaming | Apache Kafka, Zookeeper |
| AWS Simulation | LocalStack (S3, IAM, SSM) |
| SAST | Semgrep |
| Secrets Scanning | Gitleaks |
| CI/CD | GitHub Actions |
| Containerization | Docker, docker-compose |
