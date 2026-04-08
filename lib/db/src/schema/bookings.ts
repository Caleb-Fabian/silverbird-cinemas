import { pgTable, text, integer, timestamp, serial, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { showtimesTable } from "./showtimes";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  showtimeId: integer("showtime_id").notNull().references(() => showtimesTable.id, { onDelete: "cascade" }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  selectedSeats: text("selected_seats").notNull(), // JSON array stored as text e.g. '["A1","A2"]'
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("confirmed"), // confirmed | cancelled
  bookingReference: text("booking_reference").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
