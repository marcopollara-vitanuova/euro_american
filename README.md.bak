# HARNESS Engineering Starter Pack per Cursor

Questo repository scaffold contiene il sistema operativo per far lavorare un agente AI in modo controllato, verificabile e progressivo.

## Obiettivo
Costruire un harness per agenti AI che consenta di usare Cursor/Codex/LLM coding agent in modalità spec-driven, con guardrail, tracciabilità, human-in-the-loop, controllo di sicurezza e qualità.

## Principi fondanti
1. Repository-first: tutto ciò che l'agente deve sapere vive nel repository.
2. Spec-driven development: nessuna implementazione senza SDD approvato.
3. Human-in-the-loop: l'agente propone, l'umano approva le decisioni critiche.
4. Least privilege: accessi iniziali solo read-only o utenze test dedicate.
5. Incremental delivery: un'integrazione, un MCP, un plugin, un accesso alla volta.
6. Quality gates: test, lint, review, security check e compliance check prima di merge o deploy.
7. Entropy management: pulizia periodica di documentazione, drift, duplicazioni, dipendenze e codice morto.

## Alberatura
```text
.
├── AGENT.md
├── README.md
├── PROJECT_CONTEXT.md
├── .cursor/
│   ├── rules.md
│   └── prompts.md
├── docs/
│   ├── sdd/
│   │   ├── 00-executive-brief.md
│   │   ├── 01-system-design-document.md
│   │   ├── 02-architecture-decision-records.md
│   │   ├── 03-data-access-and-mcp-policy.md
│   │   ├── 04-security-compliance-controls.md
│   │   └── 05-observability-and-feedback.md
│   ├── governance/
│   │   ├── ai-policy.md
│   │   ├── human-in-the-loop.md
│   │   ├── risk-register.md
│   │   └── review-model.md
│   └── prompts/
│       ├── 00-master-prompt.md
│       ├── 01-discovery-prompt.md
│       ├── 02-sdd-generation-prompt.md
│       ├── 03-implementation-prompt.md
│       ├── 04-review-prompt.md
│       └── 05-entropy-cleanup-prompt.md
├── checklists/
│   ├── readiness-checklist.md
│   ├── pr-review-checklist.md
│   └── production-release-checklist.md
├── templates/
│   ├── adr-template.md
│   ├── task-brief-template.md
│   └── pr-template.md
├── skills/
│   └── harness-sdd/
│       ├── SKILL.md
│       └── references/
│           └── sdd-output-template.md
├── scripts/
│   └── harness_validate.py
└── tests/
    └── harness/
        └── test_harness_docs.py
```

## Come usarlo con Cursor
1. Copia tutto nel root del repository target.
2. Apri Cursor e incolla `docs/prompts/00-master-prompt.md`.
3. Fai eseguire prima discovery e SDD, non codice.
4. Approva gli ADR e le policy di accesso.
5. Procedi per micro-task con prompt dedicati.
6. Ogni output deve aggiornare SDD, ADR, checklists e test.
