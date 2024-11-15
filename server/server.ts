import { db } from "./db";
import { AccountTable } from "./db/schema";
import { sql } from "drizzle-orm";
import dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';


// Load environment variables
dotenv.config();

const app: Application = express();

const port = process.env.PORT || 8080;

const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Get all Users
app.get('/api/v1/users', async (req, res) => {
  try {

  } catch (err) {
    console.log(err);
  }
});

// Get a User
app.get("/api/v1/users/:id", async (req, res) => {
  console.log(req.params);

  try {

  } catch (err) {
    console.log(err);
  }
});

// Create a User 
app.post("/api/v1/users", async (req, res) => {
  console.log(req.body);

  try {

  } catch (err) {
    console.log(err);
  }
  
});

// Update a User
app.put("/api/v1/users/:id", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);

  try {

  } catch (err) {
    console.log(err);
  }

  
});

// Delete a User
app.delete("/api/v1/users/:id", async (req, res) => {
  console.log(req.params.id);

  try {

  } catch (err) {
    console.log(err);
  }

  
});

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});

/*
async function main() {
  const user = await db.insert(AccountTable).values({
    username: "Marek",
    password: "marecek"
  }).returning({
    accountId: AccountTable.accountId
  });

  console.log(user);
};

/*
async function main() {
  const accounts = await db.query.AccountTable.findMany({
    columns: { username: true},
    extras: { lowerCaseName: sql<string>`lower(${AccountTable.username})`
    .as("lowerCaseName") }
  });

  console.log(accounts);
}
*/

/*
async function main() {
  const accounts = await db.query.AccountTable.findMany({
    columns: { username: true},

  });

  console.log(accounts);
}

main();
*/