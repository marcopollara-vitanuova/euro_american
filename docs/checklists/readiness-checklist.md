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

- [ ] Decidere se mantenere o rimuovere i backup `.bak` creati durante l'import.
- [ ] Decidere se dichiarare `pytest` in un file di dipendenze dev o demandarlo all'ambiente cloud.
- [ ] Estendere `scripts/harness_validate.py` per link Markdown, path canonici e drift prompt/rules.
