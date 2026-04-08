import { Router, type IRouter } from "express";
import { db, bookingsTable, showtimesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

function generateBookingReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "SB-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// POST /bookings
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
      res.status(400).json({ error: "Missing required fields: showtimeId, customerName, customerEmail, selectedSeats" });
      return;
    }

    const numShowtimeId = Number(showtimeId);
    if (Number.isNaN(numShowtimeId)) {
      res.status(400).json({ error: "Invalid showtimeId" });
      return;
    }

    // Fetch the showtime to get price and check availability
    const [showtime] = await db
      .select()
      .from(showtimesTable)
      .where(eq(showtimesTable.id, numShowtimeId))
      .limit(1);

    if (!showtime) {
      res.status(404).json({ error: "Showtime not found" });
      return;
    }

    if (showtime.availableSeats < selectedSeats.length) {
      res.status(409).json({ error: "Not enough available seats" });
      return;
    }

    const pricePerSeat = Number(showtime.price);
    const totalAmount = (pricePerSeat * selectedSeats.length).toFixed(2);
    const selectedSeatsJson = JSON.stringify(selectedSeats);
    const bookingReference = generateBookingReference();

    // Decrement available seats and insert booking in parallel
    await db
      .update(showtimesTable)
      .set({
        availableSeats: showtime.availableSeats - selectedSeats.length,
      })
      .where(eq(showtimesTable.id, numShowtimeId));

    const [booking] = await db
      .insert(bookingsTable)
      .values({
        showtimeId: numShowtimeId,
        customerName,
        customerEmail,
        customerPhone: customerPhone ?? null,
        selectedSeats: selectedSeatsJson,
        totalAmount,
        status: "confirmed",
        bookingReference,
      })
      .returning();

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
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

export default router;
