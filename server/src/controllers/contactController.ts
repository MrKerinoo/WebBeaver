import { Request, Response } from "express";
import { db } from "../../db";
import { ContactFormTable } from "../../db/schema";
import { asc } from "drizzle-orm";
import { formSchema } from "../schemes";

export const getContactForm = async (req: Request, res: Response) => {
  try {
    const forms = await db.query.ContactFormTable.findMany({
      orderBy: [asc(ContactFormTable.createdAt)],
    });

    res.status(200).json({
      status: "success",
      data: {
        forms: forms,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to get contact forms",
    });
  }
};

export const createContactForm = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, message } = req.body;

  try {
    const result = formSchema.safeParse({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      message: message,
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

    // created_at handled in database
    const contact = await db.insert(ContactFormTable).values({
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email: result.data.email,
      phone: result.data.phone,
      message: result.data.message,
    });

    res.status(201).json({
      status: "success",
      message: "Kontaktný formulár bol úspešne odoslaný",
      data: {
        contact: contact,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to send contact form",
    });
  }
};
