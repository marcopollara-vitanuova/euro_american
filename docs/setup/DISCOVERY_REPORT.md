# Discovery report - HARNESS

Data: 2026-05-22

## Obiettivo

Avviare il progetto HARNESS leggendo lo scaffold repository-first, costruendo
una mappa operativa, identificando gap/rischi/priorita' e proponendo un piano
di battaglia per sprint senza introdurre codice applicativo.

## File letti

- `AGENT.md`
- `.cursor/README.md`
- `.cursor/rules.md`
- `.cursor/prompts.md`
- `.cursor/mcp.json`
- `.cursor/rules/*.mdc`
- `PROJECT_CONTEXT.md`
- `README.md`
- `docs/specs/SDD.md`
- `docs/sdd/*.md`
- `docs/governance/*.md`
- `docs/prompts/*.md`
- `docs/checklists/*.md`
- `docs/templates/*.md`
- `skills/harness-sdd/SKILL.md`
- `skills/harness-sdd/references/sdd-output-template.md`
- `scripts/harness_validate.py`
- `tests/harness/test_harness_docs.py`

## Mappa repository

```text
.
├── .cursor/
│   ├── README.md
│   ├── mcp.json
│   ├── prompts.md
│   ├── rules.md
│   └── rules/
│       ├── harness-access-security.mdc
│       ├── harness-context.mdc
│       ├── harness-governance.mdc
│       ├── harness-human-review.mdc
│       ├── harness-sdd-workflow.mdc
│       └── harness-validation-dod.mdc
├── AGENT.md
├── PROJECT_CONTEXT.md
├── README.md
├── docs/
│   ├── checklists/
│   ├── governance/
│   ├── prompts/
│   ├── sdd/
│   ├── setup/
│   ├── specs/
│   └── templates/
├── scripts/
│   └── harness_validate.py
├── skills/
│   └── harness-sdd/
└── tests/
    └── harness/
```

## Lettura sintetica dello scaffold

- `AGENT.md` definisce regola zero, modalita' di lavoro, confini, policy di
  accesso, Definition of Done ed escalation.
- `.cursor/` inizializza Cursor con regole always-on, prompt index e MCP vuoto
  coerente con policy A0/A1.
- `PROJECT_CONTEXT.md` chiarisce dominio, obiettivo harness, vincoli strategici
  e non-obiettivi.
- `docs/specs/SDD.md` e `docs/sdd/` costituiscono il control plane
  architetturale e decisionale.
- `docs/governance/` copre AI policy, human-in-the-loop, review model e risk
  register.
- `docs/prompts/` contiene i prompt operativi per discovery, SDD,
  implementazione, review ed entropy cleanup.
- `docs/checklists/` e `docs/templates/` forniscono controlli e artefatti
  riusabili per PR, readiness, release, ADR e task brief.
- `skills/harness-sdd/` contiene una skill riusabile per generare/revisionare
  documenti HARNESS.
- `scripts/harness_validate.py` e `tests/harness/test_harness_docs.py`
  implementano il controllo deterministico minimo.

## Gap rilevati

| ID | Gap | Impatto | Priorita' | Azione proposta |
|---|---|---:|---:|---|
| G-001 | Il branch di lavoro contiene la configurazione Cursor, ma `origin/main` non la contiene finche' la PR non viene mergiata. | M | Alta | Mergiare la PR dopo review. |
| G-002 | `pytest` non e' installato nell'ambiente cloud corrente. | B | Media | Documentare comando alternativo o aggiungere env setup se si vogliono test pytest nativi. |
| G-003 | Le checklist sono template operativi non ancora compilati per una release/progetto reale. | M | Media | Compilare readiness checklist nello sprint di setup. |
| G-004 | Non esiste ancora un task brief reale per il primo micro-task agentico. | M | Alta | Crearlo da `docs/templates/task-brief-template.md`. |
| G-005 | I file `.bak` sono presenti come backup richiesti durante l'import; possono creare rumore se mantenuti a lungo. | B | Bassa | Decidere se conservarli fino a merge o rimuoverli dopo approvazione. |

## Rischi principali

| ID | Rischio | Fonte | Mitigazione |
|---|---|---|---|
| R-001 | Drift tra regole Cursor, SDD e prompt. | Molte fonti normative nel repo. | Entropy cleanup periodico e validator esteso. |
| R-002 | Agente che procede senza task brief accettabile. | Prompt implementazione ancora placeholder. | Obbligare task brief prima di ogni micro-task. |
| R-003 | Accessi esterni/MCP configurati prematuramente. | Futuri setup MCP/plugin. | Mantenere `.cursor/mcp.json` vuoto finche' non esiste ADR approvato. |
| R-004 | Compliance non verificata su dati personali o produzione. | Dominio insurtech/regolato. | Usare gate human-in-the-loop e policy data access A2+. |
| R-005 | Validazione minima troppo debole per uso reale. | Validator controlla solo presenza file e marker vietati. | Estendere validator per link, path canonici, checklist e ADR. |

## Priorita'

1. Consolidare setup e merge della configurazione Cursor.
2. Compilare readiness checklist e chiudere open point di setup.
3. Preparare task brief del primo micro-task senza accessi esterni.
4. Estendere validator e test documentali.
5. Definire processo per ADR, review e metriche di feedback loop.

## Piano di battaglia in sprint

### Sprint 0 - Stabilizzazione scaffold

- Mergiare configurazione Cursor e documentazione di setup.
- Confermare percorsi canonici: `.cursor/`, `docs/specs/`, `docs/sdd/`,
  `docs/prompts/`, `docs/checklists/`, `docs/templates/`.
- Compilare `docs/checklists/readiness-checklist.md` per lo stato reale.
- Decidere gestione dei backup `.bak`.

### Sprint 1 - Validazione e readiness

- Estendere `scripts/harness_validate.py` per:
  - verificare path canonici;
  - individuare riferimenti obsoleti;
  - controllare link locali Markdown;
  - segnalare `.bak` oltre la fase di import se non autorizzati.
- Rendere eseguibile una suite test standard, preferibilmente con `pytest` o
  alternativa documentata.

### Sprint 2 - Primo micro-task controllato

- Creare task brief da `docs/templates/task-brief-template.md`.
- Scegliere un task solo documentale o locale, senza accessi esterni.
- Eseguire prompt `docs/prompts/03-implementation-prompt.md`.
- Misurare output con checklist PR e review model.

### Sprint 3 - Governance operativa

- Formalizzare ADR per eventuali accessi futuri.
- Definire owner per sicurezza/compliance/review.
- Collegare risk register, checklist e PR template.

### Sprint 4 - MCP/plugin read-only

- Solo dopo Sprint 0-3, proporre un singolo MCP/plugin read-only in sandbox.
- Richiedere ADR, data classification, owner, logging e revoca.
- Validare con test prima di qualunque accesso write.

## Open point

- Decision needed: mantenere i file `.bak` nel branch fino al merge o rimuoverli
  dopo approvazione umana?
- Open point: installare `pytest` nell'ambiente cloud o continuare con test
  diretti via Python?
- Open point: quale sara' il primo micro-task reale da descrivere nel task
  brief?

## Prossimo step consigliato

Eseguire Sprint 0: review e merge della PR di setup, poi compilare la readiness
checklist come stato operativo del repository.
