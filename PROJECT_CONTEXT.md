# PROJECT_CONTEXT - HARNESS Engineering per agenti AI

## Contesto aziendale
Vitanuova/Axidigital opera in ambito insurtech e brokeraggio assicurativo digitale. Il contesto richiede attenzione a sicurezza, compliance, IVASS, GDPR, DORA, NIS2, EU AI Act e governance dei sistemi AI.

## Intento del progetto
Realizzare un harness per orchestrare agenti AI/Cursor in modo sicuro, governato e misurabile.

## Vincoli strategici
- Non partire con utenze amministrative personali o aziendali.
- Usare inizialmente utenze test dedicate e privilegi minimi.
- Preferire accessi read-only nelle prime fasi.
- Integrare un solo MCP/plugin/accesso alla volta.
- Testare ogni integrazione prima di qualunque rilascio in produzione.
- Applicare spec-driven development e monitoraggio continuo.
- Mantenere human-in-the-loop sulle decisioni critiche.

## Definizione operativa di harness
L'harness è il sistema di regole, documentazione, vincoli architetturali, test, feedback loop, policy di accesso e controlli che permette ad agenti AI di produrre output affidabili senza libertà operativa non governata.

## Ambito iniziale
- Cursor come ambiente operativo principale.
- Repository-first documentation.
- SDD e ADR come control plane.
- Rules e prompt standardizzati.
- Skill opzionale per generare/revisionare SDD e prompt di agenti.
- Controlli minimi automatici su documentazione, tracciabilità e readiness.

## Non-obiettivi iniziali
- Nessun accesso in scrittura a sistemi reali.
- Nessun deploy automatico in produzione.
- Nessun trattamento di dati personali reali senza DPIA/valutazione privacy.
- Nessuna integrazione contemporanea di molteplici plugin o MCP.
