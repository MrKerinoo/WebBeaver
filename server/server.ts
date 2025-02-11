import { db } from "./db";
import {
  AccountTable,
  RefreshTokenTable,
  ContactFormTable,
  InvoiceTable,
} from "./db/schema";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import path from "path";
import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";

import authenticateToken from "./middleware/authenticateToken";

// Load environment variables
dotenv.config();

const app: Application = express();

const port = process.env.PORT || 8080;

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

//Storage for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile_pictures");
  },
  filename: function (req, file, cb) {
    const time = Date.now();
    const fileName = `${time}-${file.originalname}`;
    cb(null, fileName);
  },
});
const uploadImages = multer({ storage: imageStorage });

//Storage for files
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/files");
  },
  filename: function (req, file, cb) {
    const time = Date.now();
    const fileName = `${time}-${file.originalname}`;
    cb(null, fileName);
  },
});
const uploadFiles = multer({ storage: fileStorage });

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Meno musí mať aspoň 3 znaky" })
    .max(20, { message: "Meno môže mať maximálne 20 znakov" }),

  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Rola je povinná" }),
  }),
});

const profileSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Meno musí mať aspoň 3 znaky!" })
    .max(20, { message: "Meno môže mať maximálne 20 znakov!" }),

  lastName: z
    .string()
    .min(3, { message: "Priezvisko musí mať aspoň 3 znaky!" })
    .max(20, { message: "Priezvisko môže mať maximálne 20 znakov!" }),

  email: z.string().email({ message: "Emailová adresa musí byť platná!" }),

  phone: z.string().regex(/^\+?\d{10,12}(\s?\d{1,})*$/, {
    message: "Telefónne číslo musí byť platné a obsahovať 10-12 číslic!",
  }),

  iban: z.string().regex(/^SK\d{22}$/, {
    message: "IBAN musí mať 24 čísiel a byť bez medzier!",
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

const formSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Meno musí mať aspoň 3 znaky" })
    .max(20, { message: "Meno môže mať maximálne 20 znakov" }),

  lastName: z
    .string()
    .min(3, { message: "Priezvisko musí mať aspoň 3 znaky" })
    .max(20, { message: "Priezvisko môže mať maximálne 20 znakov" }),

  email: z.string().email({ message: "Emailová adresa musí byť platná." }),

  phone: z.string().regex(/^\+?\d{10,12}$/, {
    message: "Telefónne číslo musí byť platné a obsahovať 10-12 číslic.",
  }),

  message: z
    .string()
    .min(10, { message: "Správa musí mať aspoň 10 znakov." })
    .max(500, { message: "Správa môže mať maximálne 500 znakov." }),
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
app.get("/api/users/:id", authenticateToken, async (req, res) => {
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
});

// Create a User
app.post("/api/users", authenticateToken, async (req, res) => {
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
});

// Update a User
app.put("/api/users/:id", authenticateToken, async (req, res) => {
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

    console.log("SKONTROLOVAL SOM SPRAVNE", result.data);
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
});

// Delete a User
app.delete("/api/users/:id", authenticateToken, async (req, res) => {
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
});

//Update a profile
app.post("/api/profiles/:id", authenticateToken, async (req, res) => {
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
});

//Get a new access token
app.post("/api/auth/refresh-token", async (req, res) => {
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
});

app.post(
  "/api/auth/validate-token",
  authenticateToken,
  async (req: any, res) => {
    const user = req.user;
    res.status(200).json({
      status: "success",
      data: { user },
      message: "Token is valid",
    });
  }
);

//Delete a refresh token
app.delete("/api/auth/logout", async (req, res) => {
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
});

function generateAccessToken(user: any) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
}

function generateRefreshToken(user: any) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, {});
}

// Upload a profile picture
app.post(
  "/api/files/upload/picture",
  authenticateToken,
  uploadImages.single("file"),
  async (req: any, res: any) => {
    const file = req.file;
    const user = JSON.parse(req.body.user);

    if (!file) {
      return res.status(400).json({
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
  }
);

//Upload and create invoice
app.post(
  "/api/files/upload/invoice",
  authenticateToken,
  uploadFiles.single("file"),
  async (req: any, res: any) => {
    const file = req.file;
    const invoiceData = JSON.parse(req.body.invoiceData);
    const { accountId, expirationDate } = invoiceData;

    if (!file) {
      return res.status(400).json({
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
  }
);

//Get all invoices
app.get("/api/uploads/files", authenticateToken, async (req, res) => {
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
});

//Get all invoices of an user
app.post("/api/uploads/files", authenticateToken, async (req, res) => {
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
});

//Update an invoice
app.put("/api/invoices/:id", authenticateToken, async (req, res) => {
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
});

//Delete an invoice
app.delete("/api/invoices/:id", authenticateToken, async (req, res) => {
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
});

//Download an invoice
app.get("/api/download/:filename", authenticateToken, (req, res) => {
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
});

// Get all contact forms
app.get("/api/contact", authenticateToken, async (req, res) => {
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
});

// Contact form
app.post("/api/contact", async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
