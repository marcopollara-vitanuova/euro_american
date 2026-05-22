# AGENTS.md

## Cursor Cloud specific instructions

### Panoramica servizi

Questo repository è un **governance scaffold** per agenti AI (HARNESS Engineering Starter Pack) con un'app Next.js placeholder. Non richiede database, Docker, o servizi esterni.

| Servizio | Comando | Note |
|----------|---------|------|
| Next.js dev server | `npm run dev` | Porta 3000 |
| Validazione harness | `python3 scripts/harness_validate.py` | Controlla file richiesti, marker vietati, link md |
| Test pytest | `python3 -m pytest tests/harness/test_harness_docs.py` | Verifica docs harness |
| Full test suite | `npm test` | Esegue validazione + pytest |
| Build produzione | `npm run build` | Build statica Next.js |

### Come avviare lo sviluppo

1. Le dipendenze vengono installate automaticamente dall'update script (`npm install` + `pip install -r requirements-dev.txt`).
2. Avvia il dev server con `npm run dev` (porta 3000).
3. Prima di ogni commit, esegui `npm test` per validare harness e documentazione.

### Caveat e gotcha

- pytest è installato in `~/.local/bin`; assicurarsi che sia nel PATH (`export PATH="$HOME/.local/bin:$PATH"`), oppure usare `python3 -m pytest`.
- Il progetto usa **plain JavaScript** (no TypeScript) per l'app Next.js.
- Non esiste `.env` — nessun secret o variabile d'ambiente necessaria.
- Il validator (`harness_validate.py`) verifica che specifici file esistano e non siano vuoti; se si aggiungono nuovi file richiesti, aggiornare la lista `REQUIRED` nello script.
- `npm test` combina validazione Python + pytest in un unico comando.
