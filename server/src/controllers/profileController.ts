import { eq } from "drizzle-orm";
import { db } from "../../db";
import { AccountTable } from "../../db/schema";
import { profileSchema } from "../schemes";
import { Request, Response } from "express";

export const updateProfile = async (req: Request, res: Response) => {
  const accountId = parseInt(req.params.id);
  const { firstName, lastName, email, iban, phone, picture } = req.body;

  try {
    const result = profileSchema.safeParse({
      firstName: firstName,
      lastName: lastName,
      picture: picture,
      phone: phone,
      email: email,
      iban: iban,
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
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        phone: result.data.phone,
        picture: picture,
        iban: result.data.iban,
      })
      .where(eq(AccountTable.accountId, accountId))
      .returning();

    res.status(200).json({
      status: "success",
      message: "User updated",
      data: {
        user: user,
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
