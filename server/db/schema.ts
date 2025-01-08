import { pgEnum, pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const AccountRole = pgEnum("account_role", ["ADMIN", "USER"]);

// ACCOUNT TABLE
export const AccountTable = pgTable("account", {
  accountId: serial("account_id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: AccountRole("role").default("USER").notNull(),
  firstName: varchar("first_name", { length: 20 }),
  lastName: varchar("last_name", { length: 20 }),
  picture: varchar("picture", { length: 255 }),
  phone: varchar("phone", { length: 15 }),
  email: varchar("email", { length: 50 }),
  iban: varchar("iban", { length: 24 }),
});

export const AccountTableRelations = relations(AccountTable, ({ many }) => {
  return {
    refreshTokens: many(RefreshTokenTable),
  };
});

//REFRESH TOKEN TABLE
export const RefreshTokenTable = pgTable("refresh_token", {
  refreshTokenId: serial("refresh_token_id").primaryKey(),
  token: varchar("token", { length: 1024 }).notNull(),
  accountId: integer("account_id")
    .notNull()
    .references(() => AccountTable.accountId),
});

export const RefreshTokenTableRelations = relations(
  RefreshTokenTable,
  ({ one }) => {
    return {
      account: one(AccountTable, {
        fields: [RefreshTokenTable.accountId],
        references: [AccountTable.accountId],
      }),
    };
  }
);

export const ContactFormTable = pgTable("contact_form", {
  contactFormId: serial("contact_form_id").primaryKey(),
  firstName: varchar("first_name", { length: 20 }).notNull(),
  lastName: varchar("last_name", { length: 20 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  email: varchar("email", { length: 50 }).notNull(),
  message: varchar("message", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
