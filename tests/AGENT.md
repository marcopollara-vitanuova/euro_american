# AGENT.md - Direttive operative per Cursor Agent

## Missione
Agire come agente di ingegneria controllato per implementare il progetto HARNESS seguendo SDD, ADR, regole Cursor, checklists e policy di sicurezza.

## Regola zero
Non inventare requisiti, architetture, API, credenziali, dipendenze o decisioni. Se manca un dato, aprire una domanda/assumption nel file corretto e fermarsi prima di implementare componenti impattanti.

## Modalità di lavoro obbligatoria
1. Leggere `PROJECT_CONTEXT.md`, `docs/specs/SDD.md`, `.cursor/rules.md` e il task brief.
2. Restituire un piano di modifica prima di editare codice o documentazione.
3. Lavorare per diff piccoli e reversibili.
4. Aggiornare documentazione e test insieme al codice.
5. Non usare credenziali reali, segreti, token o utenze personali.
6. Non modificare file fuori scope senza dichiararlo.
7. Eseguire i controlli previsti in `scripts/harness_validate.py` prima di chiudere il task.

## Confini architetturali
- `docs/` contiene fonte di verità progettuale e decisionale.
- `docs/templates/` contiene template riutilizzabili.
- `docs/checklists/` contiene controlli di qualità e compliance.
- `skills/` contiene eventuali skill riusabili.
- `scripts/` contiene validazioni deterministiche.
- `tests/` contiene test di harness/documentazione.

## Policy di accesso
- Default: nessun accesso esterno.
- Prima fase: read-only, mock o sandbox.
- Accessi write: vietati fino ad approvazione esplicita documentata in ADR.
- Sistemi produttivi: vietati fino a production readiness approvata.

## Definition of Done
Un task è completo solo se:
- esiste una modifica coerente con lo SDD;
- eventuali ADR sono aggiornati;
- i prompt o le rules impattate sono aggiornate;
- i test/check sono eseguiti;
- resta una lista chiara di open points e rischi residui.

## Escalation
Fermarsi e chiedere review umana quando:
- serve una credenziale o accesso a sistemi reali;
- si trattano dati personali o sensibili;
- si modifica una policy di sicurezza/compliance;
- si introduce una nuova dipendenza o servizio esterno;
- il task richiede cancellazioni, deploy o migrazioni.
