import { db } from "./db";
import { AccountTable } from "./db/schema";
import { asc, eq}  from "drizzle-orm";
import { z } from "zod";
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

//Validation Schema

const userSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Meno musí mať aspoň 3 znaky" })
    .max(20, { message: "Meno môže mať maximálne 20 znakov" }),

  password: z
    .string()
    .min(6, { message: "Heslo musí mať aspoň 6 znakov" })
    .max(20, { message: "Heslo musí mať maximálne 20 znakov" }),

  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Rola je povinná" }),
  }),
});


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
  const { username, password, role } = req.body;

  try {
    const result = userSchema.safeParse({
      username: username,
      password: password,
      role: role,
    });

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      res.status(500).json({
        status: "fail",
        errors,
      });
      return;
    }

    const user = await db.insert(AccountTable).values({
      username: result.data.username,
      password: result.data.password,
      role: result.data.role,
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
  const { username, password, role } = userSchema.parse(req.body);

  try {
    const result = userSchema.safeParse({
      username: username,
      password: password,
      role: role,
    });

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      res.status(500).json({
        status: "fail",
        errors,
      });
      return;
    }

    const user = await db
      .update(AccountTable)
      .set({
        username: result.data.username,
        password: result.data.password,
        role: result.data.role,
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