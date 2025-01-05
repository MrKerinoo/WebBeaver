import { db } from "./db";
import { AccountTable, RefreshTokenTable } from "./db/schema";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import authenticateToken from "./middleware/authenticateToken";

// Load environment variables
dotenv.config();

const app: Application = express();

const port = process.env.PORT || 8080;

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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

const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Meno musí mať aspoň 3 znaky" })
    .max(20, { message: "Meno môže mať maximálne 20 znakov" }),

  password: z
    .string()
    .min(6, { message: "Heslo musí mať aspoň 6 znakov" })
    .max(20, { message: "Heslo musí mať maximálne 20 znakov" }),
});

// Get all Users
app.get("/api/users", authenticateToken, async (req, res) => {
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
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await db.query.AccountTable.findFirst({
      where: eq(AccountTable.accountId, parseInt(req.params.id)),
    });

    res.status(200).json({
      status: "success",
      message: "User found",
      data: {
        user: user,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Create a User
app.post("/api/users", async (req, res) => {
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
      res.status(400).json({
        status: "error",
        message: "Nesprávne údaje",
        errors,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 13);

    const user = await db.insert(AccountTable).values({
      username: result.data.username,
      password: hashedPassword,
      role: result.data.role,
    });

    res.status(201).json({
      status: "success",
      message: "User created",
      data: {
        account: user,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Update a User
app.put("/api/users/:id", async (req, res) => {
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

    const hashedPassword = await bcrypt.hash(result.data.password, 13);

    const user = await db
      .update(AccountTable)
      .set({
        username: result.data.username,
        password: hashedPassword,
        role: result.data.role,
      })
      .where(eq(AccountTable.accountId, parseInt(req.params.id)));

    res.status(200).json({
      status: "success",
      message: "User updated",
      data: {
        account: user,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete a User
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await db
      .delete(AccountTable)
      .where(eq(AccountTable.accountId, parseInt(req.params.id)));

    res.status(204).json({
      status: "success",
      message: "User deleted",
      data: {
        account: user,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//Login a User
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = loginSchema.safeParse({
      username: username,
      password: password,
    });

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      res.status(400).json({
        status: "error",
        message: "Nesprávne údaje",
        errors,
      });
      return;
    }

    const user = await db.query.AccountTable.findFirst({
      where: eq(AccountTable.username, result.data.username),
    });

    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Nesprávne meno",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      result.data.password,
      user.password
    );

    if (!isPasswordValid) {
      res.status(401).json({
        status: "error",
        message: "Nesprávne heslo",
      });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(
      user,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    await db.insert(RefreshTokenTable).values({
      token: refreshToken,
      accountId: user.accountId,
    });

    res.status(201).json({
      status: "success",
      message: "User logged in",
      data: {
        user: user,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//Get a new access token
app.post("/api/auth/token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken == null) {
    res.status(401).json({
      status: "error",
      message: "Refresh token is required",
    });
    return;
  }

  const token = await db.query.RefreshTokenTable.findFirst({
    where: eq(RefreshTokenTable.token, refreshToken),
  });

  if (!token) {
    res.status(403).json({
      status: "error",
      message: "Refresh token is invalid",
    });
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) return res.status(403).json({ status: "error" });

      const accessToken = generateAccessToken({ name: user.username });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });

      res.status(201).json({
        status: "success",
        message: "Access token generated",
      });
    }
  );
});

//Delete a refresh token
app.delete("api/auth/logout", async (req, res) => {
  const refreshToken = req.body.token;

  try {
    await db
      .delete(RefreshTokenTable)
      .where(eq(RefreshTokenTable.refreshTokenId, refreshToken));

    res.status(204).json({
      status: "success",
      message: "Refresh token deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Failed to delete refresh token",
    });
  }
});

function generateAccessToken(user: any) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15s",
  });
}

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
