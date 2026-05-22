# Import report - harness_project_bundle.zip

Data: 2026-05-22

## Sommario

Import non completato: la cartella estratta `Documents/Euro-American_project_cursor`
e il file `harness_project_bundle.zip` non risultano presenti nei percorsi
accessibili della macchina.

Root progetto corrente identificata: `/workspace`.

## Percorsi verificati

- `/home/ubuntu/Documents/Euro-American_project_cursor` - non presente
- `/workspace/Documents/Euro-American_project_cursor` - non presente
- `/root/Documents/Euro-American_project_cursor` - non presente
- `/home/ubuntu/Downloads` - non presente
- `/home/ubuntu/Desktop` - non presente
- `/home/ubuntu/Euro-American_project_cursor` - non presente
- `/workspace/Euro-American_project_cursor` - non presente
- `/tmp/Euro-American_project_cursor` - non presente
- `/mnt/data` - non presente

E' stata inoltre eseguita una ricerca mirata dei nomi attesi nei percorsi
accessibili (`/workspace`, `/home`, `/root`, `/tmp`, `/mnt`, `/opt`, `/media`,
`/var/tmp`, `/packages`) senza trovare il bundle o i file governance attesi.

## File copiati

Nessuno.

## File creati

- `docs/setup/IMPORT_REPORT.md`

## File gia' esistenti

- `README.md`

Non erano presenti file target come:

- `AGENT.md`
- `PROJECT_CONTEXT.md`
- `docs/specs/SDD.md`
- `docs/prompts/00-master-prompt.md`
- `.cursor/rules/*`

## Conflitti rilevati

Nessun conflitto di contenuto: non e' stato possibile iniziare la copia per
assenza dei sorgenti estratti.

## Decisioni prese

- Non sono stati creati placeholder per i file mancanti, per evitare di
  introdurre contenuti non provenienti dal bundle originale.
- Non sono stati creati backup `.bak`, perche' nessun file esistente e' stato
  modificato o sovrascritto.
- Il repository e' stato lasciato invariato rispetto al codice applicativo.

## Azioni manuali residue

1. Rendere disponibile nella macchina Cloud Agent la cartella estratta:
   `Documents/Euro-American_project_cursor`.
2. In alternativa, aggiungere `harness_project_bundle.zip` nel repository o in
   un percorso accessibile e rieseguire l'import.
3. Rieseguire la procedura di copia rispettando la mappatura:
   - `AGENT.md` -> root progetto
   - `PROJECT_CONTEXT.md` -> root progetto
   - `docs/**` -> `docs/`
   - `skills/**` -> `skills/`
   - `.cursor/**` -> `.cursor/`
   - template/checklist -> `docs/templates/` o `docs/checklists/`
4. Validare almeno:
   - `AGENT.md`
   - `PROJECT_CONTEXT.md`
   - `docs/specs/SDD.md`
   - `.cursor/rules/*`
   - `docs/prompts/00-master-prompt.md`

## Stato Definition of Done

- Tutti i file dello ZIP posizionati: **no**
- Alberatura target coerente: **non verificabile senza sorgenti**
- Nessun file perso: **non verificabile senza sorgenti**
- Conflitti documentati: **si'**
- `IMPORT_REPORT.md` creato: **si'**
- Repository pronto per `docs/prompts/00-master-prompt.md`: **no, file assente**
