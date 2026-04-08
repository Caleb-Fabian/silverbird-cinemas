import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cinemasTable = pgTable("cinemas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCinemaSchema = createInsertSchema(cinemasTable).omit({ id: true, createdAt: true });
export type InsertCinema = z.infer<typeof insertCinemaSchema>;
export type Cinema = typeof cinemasTable.$inferSelect;
