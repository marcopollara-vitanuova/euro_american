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


---

## ADR-004 - Readiness checklist come primo micro-task documentale
Status: Accepted

Decisione: il primo micro-task agentico dopo il setup HARNESS e' la compilazione
di `docs/checklists/readiness-checklist.md` usando lo stato reale del repository.

Razionale: il task e' locale, documentale, verificabile, senza accessi esterni e
coerente con la fase A0/A1 prevista dalla data access policy.

Conseguenze: la readiness checklist diventa il baseline operativo per Sprint 0 e
lascia tracciati gli open point non bloccanti prima di qualunque task
applicativo o integrazione MCP/plugin.


---

## ADR-005 - Rimozione backup import post-validazione
Status: Accepted

Decisione: rimuovere i file `.bak` creati durante l'import dopo merge della
configurazione HARNESS e superamento dei controlli.

Razionale: i backup erano utili durante la fase di import, ma mantenerli nel
repository dopo la validazione aumenta rumore, drift e rischio di consultare
istruzioni obsolete.

Conseguenze: il validator segnala come errore eventuali nuovi `.bak` residui.


---

## ADR-006 - Superficie web Next.js minimale per Vercel
Status: Accepted

Decisione: aggiungere una Next.js App Router minimale per esporre via web lo
stato dello scaffold HARNESS su Vercel.

Razionale: Vercel richiede un framework/build rilevabile; una landing statica
consente una prima versione accessibile senza introdurre codice applicativo del
progetto reale.

Conseguenze: `package.json`, `package-lock.json`, `app/` e script npm diventano
parte dello scaffold operativo. La pagina resta informativa finche' non viene
caricato il progetto applicativo originale.
