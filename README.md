# Davide D’Anna Design Solutions

Portfolio di Davide D’Anna. [Visita il sito](https://davidedanna.com/)

## Come pubblicare un progetto su Sanity

1. **Apri Sanity Studio.** Accedi con il tuo account e apri lo Studio del progetto `fttl92eh`. Se ti serve il link allo Studio, parti da [Sanity Manage](https://www.sanity.io/manage).
2. **Crea un progetto.** Premi **+** e scegli **Progetto** o **Project**. Inserisci il titolo e premi **Generate** accanto a **Slug**. Lo slug è la parte dell’indirizzo che identifica il progetto.
3. **Compila la scheda e carica le immagini.**

   - **Description** — scrivi una descrizione breve per la scheda nel portfolio.
   - **Body** — inserisci il testo completo che si legge aprendo il progetto.
   - **Cover** — carica l’immagine principale.
   - **Gallery** — aggiungi le altre immagini nell’ordine in cui vuoi mostrarle. Puoi aggiungere una didascalia e un testo alternativo.
   - **Category, Year e Order** — indica categoria, anno e posizione nel portfolio. In **Order**, i numeri più bassi compaiono per primi.

4. **Premi Publish.** Ricarica il [portfolio](https://davidedanna.com/#work) per controllare il risultato. Se il progetto tarda a comparire, riprova dopo poco. Non serve un nuovo deploy.

Per aggiornare un progetto già online, apri la scheda esistente, modifica i campi e premi di nuovo **Publish**. Mantieni lo stesso **Slug** per conservare il link pubblico.

## Dettagli tecnici

### Deploy e anteprima locale

GitHub Actions pubblica il sito statico a ogni push su `main`. Il sito usa percorsi dalla root del dominio (`/`).

Con Node.js 22, eseguire `npm ci`, `npm run build` e `python3 -m http.server 8000 --directory public` dalla root. L’anteprima è su `http://localhost:8000`. La build copia gli asset, impacchetta il client JavaScript e aggiunge la versione ai riferimenti di CSS e script.

### Collegamento a Sanity

Il browser legge i documenti `project` pubblicati nel dataset pubblico `production` del progetto `fttl92eh`. Il client usa l’API CDN di Sanity con `useCdn: true` e richieste senza token. La cache CDN può ritardare brevemente la comparsa delle modifiche. Non serve un webhook.

Il dominio `https://davidedanna.com` deve essere autorizzato in **API → CORS Origins** in [Sanity Manage](https://www.sanity.io/manage), con **Allow credentials** disattivato. Per usare l’anteprima locale con i dati di Sanity, autorizzare anche `http://localhost:8000`.

Le schede usano `cover` e `gallery` per le immagini e `body` per il testo esteso, con `description` come ripiego. Il sito genera gli URL delle immagini con il builder ufficiale Sanity e aggiorna i metadati SEO e Open Graph della scheda nel browser. I servizi di anteprima che leggono solo l’HTML iniziale ricevono i metadati generici del portfolio.
