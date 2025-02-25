import { Request, Response } from "express";
import { db } from "../../db";
import { AccountTable, InvoiceTable, RefreshTokenTable } from "../../db/schema";
import path from "path";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils";
import { asc, eq } from "drizzle-orm";
import fs from "fs";

export const uploadPicture = async (req: Request, res: Response) => {
  const file = req.file;
  const user = JSON.parse(req.body.user);

  if (!file) {
    res.status(400).json({
      status: "error",
      message: "No file uploaded",
    });
  }

  try {
    const oldFilePath = path.join(
      __dirname,
      "uploads/profile_pictures",
      user.picture
    );

    const userInsert = await db
      .update(AccountTable)
      .set({
        picture: file?.filename,
      })
      .where(eq(AccountTable.accountId, user.accountId))
      .returning();

    const updatedUser = userInsert[0];

    const accessToken = generateAccessToken(updatedUser);
    const refreshToken = generateRefreshToken(updatedUser);

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

    fs.unlink(oldFilePath, (err: any) => {
      if (err) {
        console.log(err);
      }
    });

    res.status(201).json({
      status: "success",
      message: "File uploaded",
      data: {
        file: file,
        user: userInsert,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Failed to upload picture",
    });
  }
};

export const uploadInvoice = async (req: Request, res: Response) => {
  const file = req.file;
  const invoiceData = JSON.parse(req.body.invoiceData);
  const { accountId, expirationDate } = invoiceData;

  if (!file) {
    res.status(400).json({
      status: "error",
      message: "No file uploaded",
    });
  }

  try {
    const invoice = await db.insert(InvoiceTable).values({
      file: file,
      accountId: parseInt(accountId),
      expirationDate: new Date(expirationDate),
    });

    res.status(201).json({
      status: "success",
      message: "File uploaded",
      data: {
        file: file,
        invoice: invoice,
      },
    });
  } catch (err) {
    console.log(err);
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Failed to upload file",
    });
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await db.query.InvoiceTable.findMany({
      orderBy: [asc(InvoiceTable.expirationDate)],
    });

    res.status(200).json({
      status: "success",
      data: {
        invoices: invoices,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Failed to get invoices",
    });
  }
};

export const getInvoice = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  try {
    const invoices = await db.query.InvoiceTable.findMany({
      where: eq(InvoiceTable.accountId, accountId),
      orderBy: [asc(InvoiceTable.expirationDate)],
    });

    res.status(200).json({
      status: "success",
      data: {
        invoices: invoices,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Failed to get invoices",
    });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  const invoiceId = parseInt(req.params.id);
  const { state } = req.body;

  try {
    const invoice = await db
      .update(InvoiceTable)
      .set({
        state: state,
      })
      .where(eq(InvoiceTable.invoiceId, invoiceId))
      .returning();

    res.status(200).json({
      status: "success",
      message: "Invoice updated",
      data: {
        invoice: invoice,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to update invoice",
    });
    console.log(err);
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const invoiceId = parseInt(req.params.id);

  try {
    const invoiceFile = await db.query.InvoiceTable.findFirst({
      where: eq(InvoiceTable.invoiceId, invoiceId),
    });

    if (!invoiceFile) {
      res.status(404).json({
        status: "error",
        message: "Invoice file doesn't exist",
      });
      return;
    }

    const filePath = path.join(
      __dirname,
      `uploads/files/${(invoiceFile.file as { filename: string }).filename}`
    );

    fs.unlink(filePath, (err: any) => {
      if (err) {
        res.status(500).json({
          status: "error",
          message: "Failed to delete file",
        });
      }
    });

    const invoice = await db
      .delete(InvoiceTable)
      .where(eq(InvoiceTable.invoiceId, invoiceId));

    res.status(204).json({
      status: "success",
      message: "Invoice deleted",
      data: {
        invoice: invoice,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  const fileName = req.params;

  const filePath = path.join(__dirname, `uploads/files/${fileName}`);
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).json({
        status: "error",
        message: "Failed to download file",
      });
    }
  });
};
