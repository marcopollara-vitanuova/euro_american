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

## Deploy eseguito

- Alias stabile: `https://workspace-vitanuova.vercel.app`
- Branch alias: `https://workspace-git-main-vitanuova.vercel.app`
- Target: production
- Stato Vercel verificato: `READY`

Gli URL univoci dei singoli deployment cambiano a ogni push su `main`; usare
l'alias stabile o la dashboard Vercel per ispezionare il deployment corrente.

## Accesso

Il deploy e' stato verificato tramite Vercel MCP/list deployments come `READY` e tramite share URL con risposta `200 OK`.
Il fetch web generico ritorna `401 Unauthorized`, quindi il progetto Vercel ha
protezione accessi attiva. Per condivisione temporanea, generare un link share da Vercel quando serve.
I token share sono temporanei e non devono essere trattati come configurazione
stabile del repository.

## Stato

Placeholder deployato. Da sostituire o integrare quando verra' caricato il
progetto applicativo originale.
