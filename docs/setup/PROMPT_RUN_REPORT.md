# Prompt run report - HARNESS sequence

Data: 2026-05-22

## Obiettivo

Eseguire in autonomia e in sequenza i 6 prompt HARNESS caricati:

1. `00-master-prompt`
2. `01-discovery-prompt`
3. `02-sdd-generation-prompt`
4. `03-implementation-prompt`
5. `04-review-prompt`
6. `05-entropy-cleanup-prompt`

Vincoli applicati: rispetto di `AGENT.md`, `.cursor/rules.md`,
`PROJECT_CONTEXT.md`, `docs/specs/SDD.md`, nessun codice applicativo, nessun
accesso esterno, nessun segreto, solo modifiche documentali safe.

## Prompt 00 - Master prompt

### File letti

- `AGENT.md`
- `.cursor/rules.md`
- `.cursor/rules/*.mdc`
- `PROJECT_CONTEXT.md`
- `docs/specs/SDD.md`
- `docs/sdd/*.md`
- `docs/governance/*.md`
- `docs/prompts/*.md`
- `docs/checklists/*.md`
- `docs/templates/*.md`
- `scripts/harness_validate.py`
- `tests/harness/test_harness_docs.py`

### Esito

HARNESS e' gia' avviato come repository-first governance scaffold. La struttura
Cursor e' presente, la policy MCP parte vuota, SDD/ADR/governance sono
allineati, e i controlli minimi sono disponibili.

### Output

- Mappa e gap gia' consolidati in `docs/setup/DISCOVERY_REPORT.md`.
- Questa esecuzione produce il report sequenziale corrente.

## Prompt 01 - Discovery prompt

### Mappa directory

```text
.
├── .cursor/                 # regole, prompt index e MCP config vuota
├── AGENT.md                 # direttive operative agenti
├── PROJECT_CONTEXT.md       # contesto aziendale e strategico
├── README.md                # introduzione e uso scaffold
├── docs/
│   ├── checklists/          # readiness, PR review, release
│   ├── governance/          # AI policy, HITL, review model, risk register
│   ├── prompts/             # prompt operativi 00-05
│   ├── sdd/                 # SDD modulare e ADR
│   ├── setup/               # report import/discovery/esecuzione
│   ├── specs/               # entrypoint SDD canonico
│   └── templates/           # ADR, PR e task brief template
├── docs/tasks/              # task brief operativi
├── scripts/                 # validatore deterministico
├── skills/                  # skill HARNESS SDD
└── tests/                   # test documentali harness
```

### Tecnologie rilevate

- Markdown per governance, SDD, prompt, checklist e template.
- Python 3 per validator e test minimi.
- Cursor rules `.mdc` per regole always-on.
- Nessun framework applicativo rilevato.

### Comandi disponibili

- `python3 scripts/harness_validate.py`
- `python3 -m pytest tests/harness/test_harness_docs.py`

### Test/lint/build rilevati

- Test documentale minimo in `tests/harness/test_harness_docs.py`.
- Validatore custom in `scripts/harness_validate.py`.
- Nessun lint/build applicativo rilevato.

### Rischi accesso/dati

- `.cursor/mcp.json` e' vuoto: nessun MCP attivo.
- Policy default A0/A1: nessun accesso esterno, solo file locali/mock.
- Rischio principale futuro: attivazione MCP/plugin senza ADR, owner, data
  classification e review.

### Documenti mancanti o incompleti

- Nessun documento bloccante mancante per lo scaffold.
- Mancava un task brief reale per eseguire il prompt 03; e' stato creato
  `docs/tasks/001-readiness-checklist-task.md` come micro-task documentale safe.
- I file `.bak` sono ancora presenti per scelta di import; restano un open point
  di entropy cleanup.

### Micro-task iniziale proposto

Compilare `docs/checklists/readiness-checklist.md` con lo stato reale del
repository, senza modificare codice applicativo e senza accessi esterni.

## Prompt 02 - SDD generation/update prompt

### Assumption

Lo SDD esiste gia'; il lavoro corretto e' aggiornarlo in modo incrementale e
tracciabile, non rigenerarlo da zero.

### SDD changes

- Creato task brief operativo `docs/tasks/001-readiness-checklist-task.md`.
- Aggiunto ADR-004 in `docs/sdd/02-architecture-decision-records.md` per
  formalizzare la compilazione della readiness checklist come primo micro-task.

### Open point

- Decidere se mantenere o rimuovere i backup `.bak` nel prossimo cleanup.
- Decidere se introdurre un file di dipendenze Python per rendere `pytest`
  riproducibile senza installazione manuale.

### Decisioni richieste

Nessuna decisione bloccante per lo scaffold corrente. Le decisioni su `.bak` e
file dipendenze sono non bloccanti e possono essere gestite in Sprint 0/1.

## Prompt 03 - Implementation prompt

### Task brief usato

- `docs/tasks/001-readiness-checklist-task.md`

### Modifica implementata

- Compilata `docs/checklists/readiness-checklist.md` in base allo stato reale
  rilevato.

### Vincoli rispettati

- Diff documentale minimo.
- Nessun codice applicativo modificato.
- Nessun accesso esterno introdotto.
- Nessun segreto o dato personale reale aggiunto.

## Prompt 04 - Review prompt

Esito: `APPROVE WITH RESIDUAL OPEN POINTS`.

### Verifiche

- Scope rispettato: solo documentazione HARNESS.
- Nessuna modifica applicativa.
- Nessun MCP/plugin o accesso esterno attivato.
- Nessun segreto aggiunto.
- SDD/ADR aggiornati per il micro-task.
- Test/check eseguiti.

### Open point residui

- Gestione `.bak` da decidere.
- Dipendenza `pytest` installata nell'ambiente cloud ma non dichiarata nel repo.

## Prompt 05 - Entropy cleanup prompt

### Piano cleanup

1. Individuare duplicazioni o riferimenti obsoleti.
2. Applicare solo correzioni documentali safe.
3. Non rimuovere `.bak` senza decisione umana esplicita, perche' sono backup
   creati durante l'import.
4. Rieseguire validator e test.

### Cleanup applicato

- Il prompt caricato `02-sdd-generation-prompt` conteneva ancora il riferimento
  generico `docs/sdd`; il repository era gia' stato corretto verso
  `skills/harness-sdd/references/sdd-output-template.md` e `docs/sdd/`.
- Aggiornato `docs/setup/DISCOVERY_REPORT.md` per segnare come risolto il gap
  relativo al task brief iniziale.
- Nessuna rimozione di backup `.bak` applicata.

## Rischi residui

| ID | Rischio | Stato | Prossima azione |
|---|---|---|---|
| RR-001 | Backup `.bak` rumorosi nel repository | closed | Rimossi e bloccati dal validator |
| RR-002 | `pytest` non dichiarato come dipendenza repo | closed | Aggiunto `requirements-dev.txt` |
| RR-003 | Validator ancora minimo | closed | Esteso per `.bak`, link Markdown e path canonici |
| RR-004 | Prima pagina web non deployabile su Vercel | closed | Aggiunta Next.js App Router minimale |

## Prossimo step

Procedere con Sprint 0/Sprint 1:

1. caricare il progetto applicativo originale;
2. creare il primo task brief di sviluppo reale;
3. mantenere la landing Next.js come placeholder finche' non sara' sostituita dal prodotto.


## Vercel deployment

Prima superficie web HARNESS deployata su Vercel:

- Alias: `https://workspace-vitanuova.vercel.app`
- Deployment: `https://workspace-7isj7a1sg-vitanuova.vercel.app`
- Nota: il progetto risulta protetto da Vercel Authentication; usare il link
  share temporaneo documentato in `docs/setup/VERCEL_DEPLOYMENT.md` oppure
  modificare le impostazioni Vercel per accesso pubblico stabile.
