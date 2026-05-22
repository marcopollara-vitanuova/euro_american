# Risk Register

| ID | Rischio | Prob. | Impatto | Mitigazione | Owner | Stato |
|---|---|---:|---:|---|---|---|
| R-001 | Agente con privilegi eccessivi | M | H | read-only/test users, ADR accessi | CTO/Security | open |
| R-002 | Drift documentale | H | M | entropy cleanup, validator | Engineering | open |
| R-003 | Dati personali nei prompt | M | H | policy dati, review privacy | Compliance | open |
| R-004 | Dipendenze non approvate | M | M | ADR + PR checklist | Engineering | open |
| R-005 | Output AI non verificato | M | H | test, review, human-in-loop | Owner task | open |
