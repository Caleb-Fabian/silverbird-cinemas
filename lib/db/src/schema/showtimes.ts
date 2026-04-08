import { pgTable, text, integer, timestamp, serial, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { moviesTable } from "./movies";
import { cinemasTable } from "./cinemas";

export const showtimesTable = pgTable("showtimes", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").notNull().references(() => moviesTable.id, { onDelete: "cascade" }),
  cinemaId: integer("cinema_id").notNull().references(() => cinemasTable.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  time: text("time").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  totalSeats: integer("total_seats").notNull().default(100),
  availableSeats: integer("available_seats").notNull().default(100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertShowtimeSchema = createInsertSchema(showtimesTable).omit({ id: true, createdAt: true });
export type InsertShowtime = z.infer<typeof insertShowtimeSchema>;
export type Showtime = typeof showtimesTable.$inferSelect;
