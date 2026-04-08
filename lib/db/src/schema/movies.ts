import { pgTable, text, integer, decimal, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const moviesTable = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  genre: text("genre").notNull(), // comma-separated
  duration: integer("duration").notNull(),
  rating: text("rating").notNull(),
  imdbScore: decimal("imdb_score", { precision: 3, scale: 1 }),
  director: text("director"),
  cast: text("cast"), // JSON array string
  posterUrl: text("poster_url"),
  bannerUrl: text("banner_url"),
  trailerUrl: text("trailer_url"),
  status: text("status").notNull().default("now-showing"), // 'now-showing' | 'coming-soon'
  releaseDate: text("release_date").notNull(),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMovieSchema = createInsertSchema(moviesTable).omit({ id: true, createdAt: true });
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof moviesTable.$inferSelect;
