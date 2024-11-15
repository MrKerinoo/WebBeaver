import { pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const AccountRole = pgEnum("account_role", ["ADMIN", "USER"]);

// ACCOUNT TABLE
export const AccountTable = pgTable("account", {
  accountId: serial("account_id").primaryKey(),  
  username: varchar("username", { length: 50 }).notNull(),  
  password: varchar("password", { length: 255 }).notNull(), 
  role: AccountRole("role").default("USER").notNull()
});

// RELATIONS

// Nastavnie one-to-many vzťahov na Drizzle úrovni, nestačí len na SQL úrovni
/*
export const AccountTableRelations = relations(AccountTable, ({ one, many }) => {
  return {
    preferences: one(UserPreferencesTable),
    posts: many(PostTable)
  }
});
*/