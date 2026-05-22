# Architecture Decision Records

## ADR-001 - Repository-first come fonte unica di verità
Status: Accepted

Decisione: tutto il contesto operativo per l'agente deve vivere nel repository.

Razionale: l'agente può rispettare solo ciò che può leggere. La documentazione esterna non sincronizzata crea drift e ambiguità.

Conseguenze: ogni modifica architetturale o procedurale aggiorna SDD/ADR/rules/prompt.

---

## ADR-002 - Accessi iniziali read-only/sandbox
Status: Accepted

Decisione: nessun accesso write o produzione nelle fasi iniziali.

Razionale: riduce il rischio operativo e consente validazione progressiva.

Conseguenze: eventuali eccezioni richiedono ADR dedicato e approvazione umana.

---

## ADR-003 - Human-in-the-loop obbligatorio per decisioni critiche
Status: Accepted

Decisione: accessi, dati personali, deploy, nuove dipendenze e policy richiedono approvazione umana.

Razionale: governance e responsabilità restano umane.

Conseguenze: l'agente deve fermarsi e dichiarare `Decision needed`.
