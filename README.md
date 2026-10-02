# Timer Asta Fantacalcio

App web super semplice per gestire il timer dell'asta del fantacalcio: ogni partecipante entra con il proprio nome e puo' premere **RILANCIA** per resettare il timer per tutti, in tempo reale.

## Avvio

```bash
npm install
npm start
```

Il server parte su `http://localhost:3000`.

## Come farlo usare agli altri partecipanti

Il server deve essere raggiungibile da chi partecipa all'asta. Opzioni:

- **Stessa rete Wi-Fi/LAN**: trova il tuo indirizzo IP locale (su Windows: `ipconfig`, cerca "Indirizzo IPv4", es. `192.168.1.23`) e fai condividere agli altri `http://<tuo-ip>:3000`. Il PC che fa da server deve restare acceso e il firewall deve permettere connessioni sulla porta 3000.
- **Deploy online** (consigliato se non siete sulla stessa rete): puoi pubblicare l'app gratuitamente su servizi come Render, Railway o Fly.io, oppure usare un tunnel temporaneo come `ngrok` (`ngrok http 3000`) per ottenere un link pubblico senza fare deploy.

## Come funziona

- Ognuno entra inserendo solo il proprio nome (nessuna password).
- Il campo "Durata timer" imposta per quanti secondi riparte il timer ad ogni rilancio (default 30s), valido per tutti.
- Premendo **RILANCIA**, il timer si resetta per tutti i partecipanti collegati e viene registrato chi ha rilanciato (visibile nello storico).
- Allo scadere del timer, tutti vedono il banner "Tempo scaduto! Aggiudicato a &lt;nome&gt;".
- Lo stato (timer, durata, storico) vive in memoria sul server: riavviando il server si azzera.
