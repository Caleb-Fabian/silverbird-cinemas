import { Router, type IRouter } from "express";
import { db, bookingsTable, showtimesTable, moviesTable, cinemasTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

function generateBookingReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "SB-";
  for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

router.get("/bookings", async (_req, res) => {
  try {
    const rows = await db
      .select({ booking: bookingsTable, showtime: showtimesTable, movie: moviesTable, cinema: cinemasTable })
      .from(bookingsTable)
      .innerJoin(showtimesTable, eq(bookingsTable.showtimeId, showtimesTable.id))
      .innerJoin(moviesTable, eq(showtimesTable.movieId, moviesTable.id))
      .innerJoin(cinemasTable, eq(showtimesTable.cinemaId, cinemasTable.id))
      .orderBy(desc(bookingsTable.createdAt));

    res.json(rows.map(({ booking, showtime, movie, cinema }) => ({
      id: String(booking.id),
      bookingReference: booking.bookingReference,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      selectedSeats: JSON.parse(booking.selectedSeats),
      totalAmount: Number(booking.totalAmount),
      status: booking.status,
      createdAt: booking.createdAt,
      movie: { id: String(movie.id), title: movie.title, poster: movie.posterUrl ?? "" },
      cinema: { id: String(cinema.id), name: cinema.name },
      showtime: { date: showtime.date, time: showtime.time },
    })));
  } catch {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.post("/bookings", async (req, res) => {
  try {
    const { showtimeId, customerName, customerEmail, customerPhone, selectedSeats } = req.body as {
      showtimeId: number | string;
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      selectedSeats: string[];
    };

    if (!showtimeId || !customerName || !customerEmail || !selectedSeats?.length) {
      res.status(400).json({ error: "Missing required fields" }); return;
    }

    const numShowtimeId = Number(showtimeId);
    const [showtime] = await db.select().from(showtimesTable).where(eq(showtimesTable.id, numShowtimeId)).limit(1);
    if (!showtime) { res.status(404).json({ error: "Showtime not found" }); return; }
    if (showtime.availableSeats < selectedSeats.length) {
      res.status(409).json({ error: "Not enough available seats" }); return;
    }

    const totalAmount = (Number(showtime.price) * selectedSeats.length).toFixed(2);
    const bookingReference = generateBookingReference();

    await db.update(showtimesTable).set({ availableSeats: showtime.availableSeats - selectedSeats.length }).where(eq(showtimesTable.id, numShowtimeId));

    const [booking] = await db.insert(bookingsTable).values({
      showtimeId: numShowtimeId, customerName, customerEmail,
      customerPhone: customerPhone ?? null,
      selectedSeats: JSON.stringify(selectedSeats),
      totalAmount, status: "confirmed", bookingReference,
    }).returning();

    res.status(201).json({
      id: String(booking.id),
      showtimeId: String(booking.showtimeId),
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone ?? null,
      selectedSeats: JSON.parse(booking.selectedSeats),
      totalAmount: Number(booking.totalAmount),
      status: booking.status,
      bookingReference: booking.bookingReference,
      createdAt: booking.createdAt,
    });
  } catch {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

export default router;
