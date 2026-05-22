# Task Brief - 001 Readiness checklist

## Obiettivo

Compilare la readiness checklist in base allo stato reale del repository HARNESS
post-setup, senza modificare codice applicativo.

## Scope incluso

- Verificare presenza dei documenti di governance e setup.
- Aggiornare `docs/checklists/readiness-checklist.md` con checkbox coerenti.
- Documentare open point non bloccanti.

## Scope escluso

- Rimozione di file `.bak`.
- Introduzione di nuove dipendenze o servizi.
- Configurazione MCP/plugin.
- Modifica di codice applicativo.

## File/aree coinvolte

- `docs/checklists/readiness-checklist.md`
- `docs/setup/PROMPT_RUN_REPORT.md`
- `docs/sdd/02-architecture-decision-records.md`

## Vincoli

- Nessun accesso esterno.
- Nessun segreto o dato personale reale.
- Diff documentale minimo e reversibile.
- Coerenza con `AGENT.md`, `.cursor/rules.md`, `PROJECT_CONTEXT.md` e SDD.

## Acceptance criteria

- Checklist compilata con stato reale.
- Open point tracciati.
- `python3 scripts/harness_validate.py` passa.
- `python3 -m pytest tests/harness/test_harness_docs.py` passa.

## Test/check richiesti

- `python3 scripts/harness_validate.py`
- `python3 -m pytest tests/harness/test_harness_docs.py`

## Decisioni richieste

Nessuna decisione bloccante. Restano decisioni non bloccanti su `.bak` e
dipendenze test dichiarative.
