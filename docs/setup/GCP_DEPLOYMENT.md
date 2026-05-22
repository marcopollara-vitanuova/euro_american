# Google Cloud Platform deployment runbook

## Target architecture

- Cloud Run service for the Next.js modular monolith.
- Cloud SQL PostgreSQL with private IP where possible.
- Secret Manager for `DATABASE_URL`, `NEXTAUTH_SECRET` and provider credentials.
- Cloud Storage private bucket for generated documents and uploads.
- Cloud Logging, Cloud Monitoring and Error Reporting enabled.
- Preferred region: `europe-west8`.

## Build and deploy outline

```bash
gcloud config set project $GCP_PROJECT_ID
gcloud run deploy axieme-mga-platform   --source .   --region europe-west8   --service-account axieme-mga-run@$GCP_PROJECT_ID.iam.gserviceaccount.com   --set-secrets DATABASE_URL=DATABASE_URL:latest,NEXTAUTH_SECRET=NEXTAUTH_SECRET:latest   --set-env-vars APP_ENV=production,GCP_REGION=europe-west8
```

## Cloud SQL

1. Create PostgreSQL instance.
2. Enable automated backups and point-in-time recovery.
3. Prefer private IP and Cloud Run connector when the network is configured.
4. Run migrations from a controlled CI/CD step:

```bash
npx prisma migrate deploy
npm run db:seed # only for non-production/demo
```

## Cloud Storage

- Bucket must be private.
- Enable object versioning and retention policy.
- Access only through authorized signed URL generation.
- Store document hash and template version in database.

## Secret Manager

Required secrets:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- future provider API keys for email, SMS, payment, signature and malware scan.

## Health checks

- `GET /api/health`
- `GET /api/ready`

## Operational controls

- Cloud Logging sink for security/audit retention.
- Alerting for 5xx, login failures, privileged access, payment/signature errors.
- Restore test periodically.
- Separate projects for dev/staging/prod before handling real data.
