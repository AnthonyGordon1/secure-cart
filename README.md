# SecureCart

> CAUTION: This app is intentionally vulnerable. Do not deploy it anywhere public or use it in production. It is a local sandbox only. LIKE SERIOUSLY THIS IS ONLY A SANDBOX AND SHOULDN'T BE USED AN ACTUAL APP.....

SecureCart is a deliberately vulnerable e-commerce app I built to tinker with application security concepts + to keep some cloud experience I got from being a Full-Stack engineer polished. It covers OWASP Top 10, AWS misconfigurations, and Kafka event stream security in a context that feels close to a real financial application. Not bleeding edge, just me learning by doing. I went ahead and threw in Localstack so I could test out the AWS enviroment without using my own real AWS assets.

---

## What is in here

- Angular frontend with Angular Material(Infrastruce Done, implementation coming soon..)
- Node/Express backend with SQLite (Infrastruce Done, implementation coming soon..)
- Apache Kafka for event streaming
- LocalStack for AWS simulation (S3, IAM, SSM)
- Intentional vulnerabilities with working exploits and verified patches (coming soon..)
- GitHub Actions CI with Semgrep SAST and Gitleaks secrets scanning (coming soon..)

---

## Getting it running locally

### What you need installed

- Node.js v22+
- Docker Desktop
- AWS CLI (`brew install awscli`)
- Python 3 (`pip3 install awscli-local`)

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/AnthonyGordon1/SecureCart.git
cd SecureCart
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
./node_modules/.bin/ng serve
```

**9. Verify everything is up**

- Frontend: http://localhost:4200
- Backend health check: http://localhost:3000/health
- S3 bucket: `aws --endpoint-url=http://localhost:4566 s3 ls`

---

## Vulnerabilities

Full write-ups with exploit scripts and patches are in `/docs/vulnerabilities` — coming as the project builds out.
