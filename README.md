# Davide D’Anna Design Solutions

Portfolio statico pubblicato da GitHub Actions su [davidedanna.com](https://davidedanna.com/) a ogni push su `main`. Il sito usa percorsi dalla root del dominio (`/`).

## Anteprima locale

Con Node.js 22, eseguire `npm ci`, `npm run build` e `python3 -m http.server 8000 --directory public` dalla root. Aprire `http://localhost:8000`. La build copia gli asset, impacchetta il client JavaScript e aggiunge la versione ai riferimenti di CSS e script.

## Sanity

Il browser legge i documenti `project` pubblicati nel dataset pubblico `production` del progetto `fttl92eh`. Il client usa l’API CDN di Sanity con `useCdn: true`, senza token. Pubblicare i progetti dallo Studio già ospitato su Sanity. Le modifiche compaiono alla successiva apertura o al ricaricamento della pagina, tenendo conto della cache CDN. Per i contenuti del portfolio non serve un webhook o un nuovo deploy.

Il dominio `https://davidedanna.com` deve essere presente in **API → CORS Origins** in [Sanity Manage](https://www.sanity.io/manage), con **Allow credentials** disattivato. Per l’anteprima locale, autorizzare anche `http://localhost:8000`.

Le schede usano `cover` e `gallery` per le immagini e `body` per il testo esteso, con `description` come ripiego. Il sito genera gli URL delle immagini con il builder ufficiale Sanity e aggiorna i metadati SEO e Open Graph della scheda nel browser. I servizi di anteprima che leggono solo l’HTML iniziale ricevono i metadati generici del portfolio.
