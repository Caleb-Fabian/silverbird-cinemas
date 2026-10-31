import { Router, type IRouter } from "express";
import { requireAdmin } from "../lib/auth";
import { db, showtimesTable, cinemasTable, moviesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function formatShowtime(showtime: typeof showtimesTable.$inferSelect, cinema: typeof cinemasTable.$inferSelect, movie?: typeof moviesTable.$inferSelect) {
  return {
    id: String(showtime.id),
    movieId: String(showtime.movieId),
    cinemaId: String(showtime.cinemaId),
    date: showtime.date,
    time: showtime.time,
    price: Number(showtime.price),
    availableSeats: showtime.availableSeats,
    totalSeats: showtime.totalSeats,
    cinema: { id: String(cinema.id), name: cinema.name, address: cinema.address },
    ...(movie && { movie: { id: String(movie.id), title: movie.title, poster: movie.posterUrl ?? "" } }),
  };
}

router.get("/showtimes", async (req, res) => {
  try {
    const movieIdParam = req.query.movieId as string | undefined;
    const query = db.select({ showtime: showtimesTable, cinema: cinemasTable, movie: moviesTable })
      .from(showtimesTable)
      .innerJoin(cinemasTable, eq(showtimesTable.cinemaId, cinemasTable.id))
      .innerJoin(moviesTable, eq(showtimesTable.movieId, moviesTable.id));

    const rows = movieIdParam
      ? await query.where(eq(showtimesTable.movieId, Number(movieIdParam)))
      : await query;

    res.json(rows.map(({ showtime, cinema, movie }) => formatShowtime(showtime, cinema, movie)));
  } catch {
    res.status(500).json({ error: "Failed to fetch showtimes" });
  }
});

router.get("/showtimes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ error: "Invalid showtime id" }); return; }
    const rows = await db.select({ showtime: showtimesTable, cinema: cinemasTable, movie: moviesTable })
      .from(showtimesTable)
      .innerJoin(cinemasTable, eq(showtimesTable.cinemaId, cinemasTable.id))
      .innerJoin(moviesTable, eq(showtimesTable.movieId, moviesTable.id))
      .where(eq(showtimesTable.id, id))
      .limit(1);
    if (!rows.length) { res.status(404).json({ error: "Showtime not found" }); return; }
    const { showtime, cinema, movie } = rows[0];
    res.json(formatShowtime(showtime, cinema, movie));
  } catch {
    res.status(500).json({ error: "Failed to fetch showtime" });
  }
});

router.post("/showtimes", requireAdmin, async (req, res) => {
  try {
    const { movieId, cinemaId, date, time, price, totalSeats } = req.body;
    if (!movieId || !cinemaId || !date || !time || !price) {
      res.status(400).json({ error: "Missing required fields" }); return;
    }
    const seats = Number(totalSeats) || 100;
    const [showtime] = await db.insert(showtimesTable).values({
      movieId: Number(movieId),
      cinemaId: Number(cinemaId),
      date, time,
      price: String(price),
      totalSeats: seats,
      availableSeats: seats,
    }).returning();

    const [cinema] = await db.select().from(cinemasTable).where(eq(cinemasTable.id, showtime.cinemaId)).limit(1);
    const [movie] = await db.select().from(moviesTable).where(eq(moviesTable.id, showtime.movieId)).limit(1);
    res.status(201).json(formatShowtime(showtime, cinema, movie));
  } catch {
    res.status(500).json({ error: "Failed to create showtime" });
  }
});

router.delete("/showtimes/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ error: "Invalid showtime id" }); return; }
    await db.delete(showtimesTable).where(eq(showtimesTable.id, id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete showtime" });
  }
});

export default router;
