# Návod na inštaláciu

Je potrebné mať nainštalované nasledujúce nástroje:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)

Ako rozbehnúť frontend:

1. Presmerovať sa do priečinku "client".
2. Následne v ňom spustiť príkaz "npm install".
3. Vytvoriť si v tomto priečinku súbor ".env", kde je potrebné si vytvoriť premenné prostredia pre frontend:

- VITE_APP_API_URL v tvare "http://localhost:PORT/api"
- VITE_APP_UPLOAD_URL v tvare ""http://localhost:PORT/uploads"
  (PORT ako na backende)

Ako rozbehnúť backend:

1. Presmerovať sa do priečinku "server".
2. Následne v ňom spustiť príkaz "npm install".
3. Vytvoriť si v tomto priečinku súbor ".env", kde je potrebné si vytvoriť premenné prostredia pre backend :

- PGHOST=localhost
- PGPORT=5432
- PGUSER=meno
- PGPASSWORD=heslo
- PGDATABASE=nazovdatabazy

4. Vygenerovať si náhodné tajné kľúče pre access a refresh tokeny a pridať ich do .env

- ACCESS_TOKEN_SECRET
- REFRESH_TOKEN_SECRET

5. Spustiť príkaz "npm run db:generate", čo vytvorí databázové entity:
6. Spustiť príkaz "npm run db:migrate", čo nahrá databázové entity do PostgreSQL databázy.

Následne je potrebné v oboch priečinkoch (najprv server) napísať príkaz "npm run develop", čo ich spustí a náledne je potrebné sa presmerovať na "http://localhost:PORT/" vo vašom prehliadači.
