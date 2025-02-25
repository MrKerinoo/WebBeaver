import { Request, Response } from "express";
import { loginSchema } from "../schemes";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils";
import { AccountTable, RefreshTokenTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "../../db";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
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
        type: "name",
        message: "Nesprávne používateľské meno.",
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
        type: "password",
        message: "Nesprávne heslo.",
      });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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
    res.status(500).json({
      status: "error",
      message: "Failed to log in",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken == null) {
    res.status(401).json({
      status: "error",
      type: "missing token",
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

      const accessToken = generateAccessToken({ user });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });

      res.status(201).json({
        status: "success",
        data: {
          user: user,
        },
        message: "Access token generated",
      });
    }
  );
};

export const validateToken = async (req: any, res: Response) => {
  const user = req.user;
  res.status(200).json({
    status: "success",
    data: { user },
    message: "Token is valid",
  });
};

export const logoutUser = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    await db
      .delete(RefreshTokenTable)
      .where(eq(RefreshTokenTable.token, refreshToken));

    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

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
};
