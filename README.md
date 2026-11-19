# Davide D’Anna Design Solutions

Portfolio statico pubblicato da GitHub Pages a ogni push su `main`.

Per l’anteprima locale, eseguire `python3 -m http.server 8000` dalla root e aprire `http://localhost:8000`.

## Collegare Sanity

1. Creare un account e un progetto in [Sanity Manage](https://www.sanity.io/manage). Creare un dataset pubblico chiamato `production` per i progetti da mostrare sul sito.
2. Copiare `studio/.env.example` in `studio/.env` e compilare `SANITY_STUDIO_PROJECT_ID`. Se il dataset ha un altro nome, aggiornare anche `SANITY_STUDIO_DATASET`.
3. Con Node.js 22.12 o successivo, eseguire `npm ci` e `npm run dev` in `studio/`. Accedere allo Studio su `http://localhost:3333` e pubblicare i progetti. Il primo elemento della galleria è la copertina.
4. Aggiungere `https://dannadavidedesign-stack.github.io` agli origin CORS nelle impostazioni API di Sanity, con le credenziali disattivate. Per l’anteprima locale, aggiungere anche `http://localhost:8000`.
5. Inserire gli stessi ID progetto e nome dataset in `js/project-data.js` e fare il push. Il sito legge solo i progetti pubblicati dal dataset pubblico e mostra uno stato vuoto fino al collegamento. Lasciare eventuali token fuori dal codice pubblico.

Per ospitare lo Studio su Sanity dopo la configurazione, eseguire `npm run deploy` in `studio/`.
