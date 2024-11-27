import { db } from "./db";
import { AccountTable } from "./db/schema";
import { asc, eq, sql } from "drizzle-orm";
import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";

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
app.get("/api/v1/users", async (req, res) => {
  try {
    const users = await db.query.AccountTable.findMany({
      orderBy: [asc(AccountTable.username)],
    });

    res.status(201).json({
      status: "success",
      results: users.length,
      data: {
        users: users,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Failed to get users",
    });
  }
});

// Get a User
app.get("/api/v1/users/:id", async (req, res) => {
  try {
    const user = await db.query.AccountTable.findFirst({
      where: eq(AccountTable.accountId, parseInt(req.params.id)),
    });

    res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Create a User
app.post("/api/v1/users", async (req, res) => {
  try {
    const user = await db.insert(AccountTable).values({
      username: req.body.username,
      password: req.body.password,
    });

    res.status(201).json({
      status: "success",
      data: {
        account: user,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Update a User
app.put("/api/v1/users/:id", async (req, res) => {
  try {
    const user = await db
      .update(AccountTable)
      .set({
        username: req.body.username,
        password: req.body.password,
      })
      .where(eq(AccountTable.accountId, parseInt(req.params.id)));

    res.status(200).json({
      status: "success",
      data: {
        account: user,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete a User
app.delete("/api/v1/users/:id", async (req, res) => {
  try {
    const user = await db
      .delete(AccountTable)
      .where(eq(AccountTable.accountId, parseInt(req.params.id)));

    res.status(204).json({
      status: "success",
      data: {
        account: user,
      },
    });
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
*/

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

/*
main();
*/
