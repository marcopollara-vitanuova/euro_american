# Readiness Checklist

## Stato repository HARNESS

- [x] PROJECT_CONTEXT presente e aggiornato
- [x] AGENT.md presente
- [x] Cursor rules presenti
- [x] SDD presente
- [x] ADR iniziali presenti
- [x] Policy accessi presente
- [x] Policy AI presente
- [x] Check PR presente
- [x] Validatore harness eseguibile
- [x] Nessun segreto o dato personale reale nei file di esempio verificato dal validator

## Open point non bloccanti

- [x] Backup `.bak` rimossi dopo merge e validazione della configurazione HARNESS.
- [x] `pytest` dichiarato in `requirements-dev.txt` per test cloud riproducibili.
- [x] `scripts/harness_validate.py` esteso per backup residui, link Markdown locali e path canonici.
- [x] Prima superficie web Vercel aggiunta con Next.js App Router minimale.
- [ ] Definire il primo task brief di sviluppo sul progetto applicativo reale dopo caricamento sorgenti.
