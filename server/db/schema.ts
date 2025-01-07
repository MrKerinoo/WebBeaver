import { pgEnum, pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const AccountRole = pgEnum("account_role", ["ADMIN", "USER"]);

// ACCOUNT TABLE
export const AccountTable = pgTable("account", {
  accountId: serial("account_id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: AccountRole("role").default("USER").notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  picture: varchar("picture", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  email: varchar("email", { length: 255 }),
  iban: varchar("iban", { length: 255 }),
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
