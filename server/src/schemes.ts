import { z } from "zod";

export const userSchema = z.object({
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

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Meno musí mať aspoň 3 znaky" })
    .max(20, { message: "Meno môže mať maximálne 20 znakov" }),

  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Rola je povinná" }),
  }),
});

export const profileSchema = z.object({
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

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Meno musí mať aspoň 3 znaky" })
    .max(20, { message: "Meno môže mať maximálne 20 znakov" }),

  password: z
    .string()
    .min(6, { message: "Heslo musí mať aspoň 6 znakov" })
    .max(20, { message: "Heslo musí mať maximálne 20 znakov" }),
});

export const formSchema = z.object({
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
