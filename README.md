# Axieme MGA Platform

Axieme MGA Platform e' una web application InsurTech per MGA / Underwriting Agency. Il progetto nasce dentro HARNESS: repository-first governance, SDD/ADR, regole Cursor, auditability, security/privacy by design e operational resilience.

> This platform is designed with security, auditability and operational resilience controls intended to support DORA/NIS2/GDPR readiness. Actual legal and regulatory compliance depends on the operating organization’s policies, governance, contracts, procedures, risk assessments, supervisory obligations and legal review. The software alone does not guarantee compliance.

## Stack

- Next.js App Router, React, TypeScript strict.
- Tailwind CSS e componenti shadcn-style locali in `components/ui`.
- API REST tramite route handler modulari.
- Zod per DTO validation.
- Auth custom demo con cookie httpOnly, bcryptjs e RBAC.
- Prisma ORM con schema PostgreSQL versionabile.
- Mock provider per email, pagamenti, firma OTP, documenti e storage GCS.
- Predisposizione GCP: Cloud Run, Cloud SQL, Secret Manager, Cloud Storage, Logging, Monitoring.

## Setup locale

```bash
cp .env.example .env
npm install
npx prisma generate
npm run dev
```

Per database locale:

```bash
docker compose up -d postgres
npx prisma migrate dev
npm run db:seed
```

## Script

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:security
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Login demo

Password per tutti gli utenti demo: `Password123!`

- `superadmin@axieme.test`
- `admin.mga@axieme.test`
- `underwriter@axieme.test`
- `broker@axieme.test`
- `collaboratore@axieme.test`

## Struttura progetto

```text
app/
  (auth)/login
  (distributor)/dashboard, customers, quotes, referrals, policies, renewals, statements, documents
  (admin)/admin/dashboard, users, products, questionnaires, pricing, security, compliance, incidents
  api/[...path]
components/
  ui, layout, forms, tables, charts, quote-wizard, questionnaire-builder, pricing-builder
lib/
  auth, permissions, prisma, pricing, rules, audit, documents, storage, payments, signature, notifications, security, compliance, demo
prisma/
  schema.prisma, seed.ts
docs/
  setup, governance, sdd, checklists, templates
```

Nota architetturale: le route admin sono esposte come `/admin/...` per evitare conflitti Next.js fra route group `(admin)` e `(distributor)` con lo stesso segmento `/dashboard`.

## Moduli principali

- **Auth & RBAC**: login email/username e password, cookie httpOnly, ruoli minimi, permission guard, tenant segregation, MFA predisposto.
- **Distributor portal**: dashboard, clienti, quote wizard, referral, polizze, rinnovi, estratti conto, documenti.
- **MGA admin**: utenti, distributori, prodotti, questionari, pricing, rules, referral queue, audit log, security, compliance, incidenti, fornitori ICT, change request.
- **Pricing engine**: calcolo configurabile per prodotto/versione, trace, regole applicate, referral/declined outcomes.
- **Rules engine**: JSON-style rules per blocking/referral/warning.
- **Questionnaire engine**: questionari versionati, sezioni, domande, condizioni, mapping pricing/documenti.
- **Documents**: PDF mock, hash, template version, signed URL mock GCS.
- **Payments**: payment link mock, eventi e idempotenza predisposta.
- **Signature**: OTP signature mock, stati e webhook predisposti.
- **Audit**: eventi critici, request/correlation ID, risk level, append-only model.

## Quote flow MVP

Login -> Dashboard -> Cliente -> Nuovo preventivo -> Prodotto -> Questionario dinamico -> Calcolo premio/referral/declined -> Proposta PDF mock -> Payment link mock -> Emissione polizza -> Firma OTP mock -> Documenti -> Audit log.

Flussi operativi attualmente navigabili:

- **Console MGA**: dashboard operativa, coda referral, dettaglio referral con azioni underwriter, audit, incidenti, security/compliance e configuratori base.
- **Portale Distributore**: dashboard con to-do e KPI, CRUD cliente demo, dettaglio cliente, quote wizard a 4 step, dettaglio preventivo con tab e azioni, archivio documenti con signed URL mock, dettaglio polizza.
- **Quote lifecycle**: creazione preventivo, salvataggio risposte, calcolo premio/referral, generazione proposta PDF mock, payment link mock, simulazione pagamento, emissione polizza, firma OTP mock e audit runtime.

## API security

Tutte le API non pubbliche passano da middleware sessione e guard applicativi. Gli endpoint pubblici sono limitati a login, password reset mock, health/readiness e webhook mock. Gli input principali sono validati con Zod. Gli errori ritornano codici non informativi.

## Data segregation

Ogni record demo contiene `tenantId`; i guard verificano ruolo, permesso, tenant e visibilita' gerarchica distributiva tramite `parentDistributorId` / discendenze.

## Google Cloud Platform

Vedi `docs/setup/GCP_DEPLOYMENT.md`.

Variabili minime:

```text
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GCP_PROJECT_ID=
GCP_REGION=europe-west8
GCP_STORAGE_BUCKET=
GCP_KMS_KEY_ID=
GCP_SECRET_MANAGER_PREFIX=
APP_ENV=
LOG_LEVEL=
AUDIT_LOG_RETENTION_DAYS=
SESSION_TIMEOUT_MINUTES=
PASSWORD_MIN_LENGTH=
MFA_REQUIRED_FOR_ADMINS=true
```

## Business Continuity & Disaster Recovery

- RPO target configurabile per ambiente.
- RTO target configurabile per ambiente.
- Cloud SQL automated backups e point-in-time recovery.
- Cloud Storage bucket versioning e retention policy.
- Restore test periodico con evidenza in change/audit log.
- Runbook operativo in `docs/setup/GCP_DEPLOYMENT.md`.
- Health check: `/api/health`.
- Readiness check: `/api/ready`.
- Graceful shutdown, retry/idempotenza webhook e circuit breaker provider predisposti.

## Security architecture

- HTTPS obbligatorio in produzione.
- Cookie httpOnly, secure, SameSite.
- Password hashing robusto con bcryptjs nel demo.
- Rate limiting predisposto in `lib/security`.
- ORM Prisma e query parametrizzate.
- Zod validation lato server.
- Security headers Next.js.
- CSP/CORS hardening da finalizzare per dominio produzione.
- Nessun dato carta salvato.
- Nessun segreto nel repository.

## GDPR e data protection

Sono predisposti: privacy consent, notice version, data retention policy, data subject request, data processing record, legal hold, soft delete/anonymization modes, audit accessi dati personali.

## DORA/NIS2 readiness

Sono predisposti: incident management, ICT third-party provider register, change management, audit log, access review, privileged access log, operational resilience runbook, backup/restore documentation.

## Secure SDLC

- TypeScript strict.
- Type check.
- Unit/documentation test.
- Dependency scanning via `npm audit`.
- Secret scanning demandata a CI/provider.
- SAST/container scanning predisposti per CI.
- SBOM generation da aggiungere in pipeline.
- Security checklist in `docs/checklists/production-release-checklist.md`.

## Stato MVP

Questa e' una prima versione navigabile end-to-end con dati demo e provider mock. Le schermate principali sono operative sul runtime demo in memoria; Prisma schema e seed sono presenti per la futura persistenza PostgreSQL.

Prima di usare dati reali o promuovere in produzione servono: persistenza runtime su Cloud SQL/PostgreSQL, sessioni firmate/rotazione secret, CSP definitiva, malware scanning, CI/CD controllata, review legale/compliance e decisione umana di deploy secondo HARNESS.

## Deploy readiness

- Preview Vercel: ammessa come verifica non produttiva tramite PR e check automatici.
- Produzione: richiede approvazione esplicita, ADR/deploy note, checklist produzione e conferma che nessun dato reale venga trattato nel demo.
- Stop condition: non promuovere a produzione se mancano secret management, ambiente dati approvato, rollback e owner operativo.
