# Data Access and MCP Policy

## Principio
Ogni accesso a dati, API, MCP o plugin deve essere minimo, tracciato, revocabile e approvato.

## Classi di accesso
| Classe | Descrizione | Default |
|---|---|---|
| A0 | Nessun accesso esterno | consentito |
| A1 | File locali/mock | consentito |
| A2 | Read-only sandbox | previa review |
| A3 | Write non-prod | vietato senza ADR |
| A4 | Produzione | vietato nella fase iniziale |

## Requisiti prima di A2+
- Scopo documentato.
- Owner nominato.
- Dati trattati classificati.
- Logging previsto.
- Rollback/revoca definita.
- Test completati.

## Dati personali
Nessun dato personale reale nei prompt o nei test senza valutazione privacy e base giuridica/documentale.
