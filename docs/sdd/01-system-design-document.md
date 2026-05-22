# System Design Document - HARNESS Engineering

## 1. Scopo
Definire un sistema operativo per agenti AI che lavori in Cursor e repository Git in modo sicuro, controllabile e verificabile.

## 2. Stakeholder
- CTO / owner tecnico.
- Team engineering.
- Security/compliance owner.
- Revisori umani delle PR.
- Eventuali fornitori AI/MCP/plugin.

## 3. Requisiti funzionali
### R1 - Context repository-first
L'agente deve trovare nel repository tutto il contesto necessario: SDD, ADR, rules, prompt, checklist, policy, template.

### R2 - Spec-driven workflow
Ogni attività deve partire da task brief e SDD. L'agente non deve implementare senza una specifica accettabile.

### R3 - Guardrail operativo
L'agente deve rispettare confini di accesso, naming, struttura, test, review e policy di sicurezza.

### R4 - Human-in-the-loop
Le decisioni ad alto impatto devono essere approvate dall'umano: accessi, dati personali, nuove dipendenze, deploy, refactor ampi, rimozioni.

### R5 - Feedback loop
L'agente deve eseguire controlli automatici, riportare errori, proporre remediation e aggiornare la documentazione.

### R6 - Entropy management
Devono esistere prompt e controlli periodici per individuare drift, duplicazioni, incoerenze e codice/documentazione obsoleti.

## 4. Requisiti non funzionali
- Sicurezza: least privilege, no secret in repo, no accessi reali by default.
- Compliance: privacy-by-design, auditabilità, tracciabilità decisionale.
- Manutenibilità: documentazione modulare, ADR obbligatori per decisioni rilevanti.
- Portabilità: harness non dipendente da un solo provider AI.
- Testabilità: validazioni deterministiche minime presenti nel repo.

## 5. Architettura logica
```text
Human Owner
   ↓ approva policy/task/ADR
Cursor Agent
   ↓ legge e produce diff
Repository Harness
   ├── AGENT.md
   ├── PROJECT_CONTEXT.md
   ├── SDD / ADR
   ├── Cursor rules
   ├── Prompt library
   ├── Checklists
   ├── Validators
   └── Tests
External Systems
   └── solo sandbox/read-only finché non approvati
```

## 6. Flusso operativo
1. Discovery: l'agente legge contesto e produce mappa repo + open points.
2. SDD: l'agente propone SDD/ADR/checklist.
3. Approval gate: umano valida decisioni e scope.
4. Implementation: agente lavora su micro-task.
5. Verification: test, lint, security review, documentation check.
6. PR review: umano valida output e rischi residui.
7. Entropy cleanup: ciclo periodico di riallineamento.

## 7. Access model
- Fase 0: nessun accesso esterno.
- Fase 1: file locali e mock.
- Fase 2: MCP/plugin read-only in sandbox.
- Fase 3: write limitato in ambienti non produttivi.
- Fase 4: produzione solo con approvazione, logging e rollback.

## 8. Rischi principali
- Over-permissioning dell'agente.
- Drift documentale.
- Modifiche non tracciate.
- Dipendenze introdotte senza review.
- Trattamento improprio di dati personali.
- Falsa confidenza dell'output AI.

## 9. Quality gates
- `python scripts/harness_validate.py`
- checklist PR completa;
- ADR aggiornati;
- nessun open point critico non risolto;
- conferma human-in-the-loop per impatti critici.

## 10. Roadmap
### Sprint 0 - Setup governance
Creare file di harness, policy, SDD, ADR, prompt, checklists.

### Sprint 1 - Validatore base
Implementare controllo documentale e readiness.

### Sprint 2 - Primo micro-task agentico
Selezionare task non critico, senza accessi esterni, e misurare output.

### Sprint 3 - MCP/plugin read-only
Integrare un solo connettore sandbox/read-only e validarlo.

### Sprint 4 - Hardening
Aggiungere osservabilità, metriche, dashboard e processo di review periodica.
