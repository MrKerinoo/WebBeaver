import { db } from "../../db";
import { AccountTable, RefreshTokenTable } from "../../db/schema";
import { asc, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { updateUserSchema, userSchema } from "../schemes";
import bcrypt from "bcrypt";

export const getAllUsers = async (req: Request, res: Response) => {
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
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const accountId = parseInt(req.params.id);

    const user = await db.query.AccountTable.findFirst({
      where: eq(AccountTable.accountId, accountId),
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
    res.status(500).json({
      status: "error",
      message: "Failed to get user",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
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
    res.status(500).json({
      status: "error",
      message: "Failed to create user",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { username, role } = req.body;

  try {
    const result = updateUserSchema.safeParse({
      username: username,
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

    const accountId = parseInt(req.params.id);
    const user = await db
      .update(AccountTable)
      .set({
        username: result.data.username,
        role: result.data.role,
      })
      .where(eq(AccountTable.accountId, accountId));

    res.status(200).json({
      status: "success",
      message: "User updated",
      data: {
        account: user,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Failed to update user",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const accountId = parseInt(req.params.id);

    const token = await db
      .delete(RefreshTokenTable)
      .where(eq(RefreshTokenTable.accountId, accountId));

    const user = await db
      .delete(AccountTable)
      .where(eq(AccountTable.accountId, accountId));

    res.status(204).json({
      status: "success",
      message: "User deleted",
      data: {
        account: user,
        tokens: token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Failed to delete user",
    });
  }
};
