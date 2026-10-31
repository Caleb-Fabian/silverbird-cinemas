import { Router, type IRouter } from "express";
import { requireAdmin } from "../lib/auth";
import { db, bookingsTable, moviesTable, showtimesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard", requireAdmin, async (_req, res) => {
  try {
    const [revenueRow] = await db
      .select({ total: sql<string>`coalesce(sum(${bookingsTable.totalAmount}), 0)` })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, "confirmed"));

    const [ticketsRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, "confirmed"));

    const [activeMoviesRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(moviesTable)
      .where(eq(moviesTable.status, "now-showing"));

    const [totalMoviesRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(moviesTable)
      .where(eq(moviesTable.isActive, 1));

    const [showtimesRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(showtimesTable);

    const recentBookings = await db
      .select({ booking: bookingsTable, movie: moviesTable })
      .from(bookingsTable)
      .innerJoin(showtimesTable, eq(bookingsTable.showtimeId, showtimesTable.id))
      .innerJoin(moviesTable, eq(showtimesTable.movieId, moviesTable.id))
      .orderBy(sql`${bookingsTable.createdAt} desc`)
      .limit(5);

    res.json({
      totalRevenue: Number(revenueRow.total),
      totalTickets: Number(ticketsRow.count),
      activeMovies: Number(activeMoviesRow.count),
      totalMovies: Number(totalMoviesRow.count),
      totalShowtimes: Number(showtimesRow.count),
      recentBookings: recentBookings.map(({ booking, movie }) => ({
        id: String(booking.id),
        bookingReference: booking.bookingReference,
        customerName: booking.customerName,
        totalAmount: Number(booking.totalAmount),
        status: booking.status,
        movieTitle: movie.title,
        createdAt: booking.createdAt,
      })),
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

export default router;
