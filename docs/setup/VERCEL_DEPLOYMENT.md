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

- Target: production
- Deployment URL: `https://workspace-7isj7a1sg-vitanuova.vercel.app`
- Alias: `https://workspace-vitanuova.vercel.app`
- Inspector: `https://vercel.com/vitanuova/workspace/9yimfBT8gMuaZKkdc4x4qeypz7Ni`
- Stato Vercel: `READY`

## Accesso

Il deploy e' stato verificato con `web_fetch_vercel_url` e risponde `200 OK`.
Il fetch web generico ritorna `401 Unauthorized`, quindi il progetto Vercel ha
protezione accessi attiva. Per condivisione temporanea e' disponibile fino al
2026-05-23 16:58 UTC:

```text
https://workspace-vitanuova.vercel.app/?_vercel_share=WyLOq5pJbikiOPhd6XC14ZQ6tgvXuhLm
```

## Stato

Placeholder deployato. Da sostituire o integrare quando verra' caricato il
progetto applicativo originale.
