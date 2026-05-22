# Cursor rules - HARNESS

Queste regole inizializzano Cursor per il repository HARNESS e derivano da
`AGENT.md`, `PROJECT_CONTEXT.md`, `docs/specs/SDD.md`, `docs/sdd/` e
`docs/governance/`.

## Rule file applicabili

- `.cursor/rules/harness-context.mdc` - caricamento contesto repository-first.
- `.cursor/rules/harness-sdd-workflow.mdc` - workflow spec-driven, SDD e ADR.
- `.cursor/rules/harness-access-security.mdc` - accessi, MCP, dati e compliance.
- `.cursor/rules/harness-human-review.mdc` - human-in-the-loop ed escalation.
- `.cursor/rules/harness-validation-dod.mdc` - validazione, documentazione e DoD.
- `.cursor/rules/harness-governance.mdc` - sintesi always-on dei guardrail.

## Regola zero

Non inventare requisiti, architetture, API, credenziali, dipendenze o decisioni.
Se manca un dato critico, dichiarare `Open point` o `Decision needed`.

## Percorsi canonici

- Prompt: `docs/prompts/`
- SDD entrypoint: `docs/specs/SDD.md`
- SDD modulare: `docs/sdd/`
- Policy governance: `docs/governance/`
- Checklist: `docs/checklists/`
- Template: `docs/templates/`
- Skill riusabili: `skills/`

## Accesso e sicurezza

- Default: A0/A1, nessun accesso esterno o solo file locali/mock.
- A2 read-only sandbox: solo previa review.
- A3 write non-prod: vietato senza ADR e approvazione.
- A4 produzione: vietato nella fase iniziale.
- Mai usare o committare segreti, dati personali reali o credenziali personali.

## Definition of Done

Prima di chiudere task di setup/governance:

1. Verificare `AGENT.md`, `PROJECT_CONTEXT.md`, `docs/specs/SDD.md`, `.cursor/rules/*`, `docs/prompts/00-master-prompt.md`.
2. Eseguire `python3 scripts/harness_validate.py`.
3. Documentare test non eseguibili per dipendenze mancanti.
4. Aggiornare `docs/setup/IMPORT_REPORT.md` quando cambia la struttura di setup.
