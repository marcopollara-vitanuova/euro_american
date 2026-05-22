# Vercel deployment - HARNESS placeholder

## Obiettivo

Rendere accessibile una prima versione web dello scaffold HARNESS prima del
caricamento del progetto applicativo originale.

## Implementazione

- Framework: Next.js App Router.
- Entry point: `app/page.js`.
- Layout: `app/layout.js`.
- Stili: `app/globals.css`.
- Build command: `npm run build`.

## Perche' e' stato aggiunto Next.js

Il primo tentativo Vercel falliva con:

```text
No Next.js version detected. Make sure your package.json has "next" in either
"dependencies" or "devDependencies".
```

Il repository era solo documentale, quindi mancavano `package.json` e dipendenze
Next. La landing attuale risolve il rilevamento framework senza introdurre
funzionalita' applicative definitive.

## Comandi verificati

```bash
npm audit --audit-level=moderate
npm run test
npm run build
```

## Stato

Placeholder deployabile. Da sostituire o integrare quando verra' caricato il
progetto applicativo originale.
