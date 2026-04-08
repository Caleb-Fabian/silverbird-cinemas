import { Router, type IRouter } from "express";
import { db, showtimesTable, cinemasTable, moviesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

// GET /showtimes?movieId=:id
router.get("/showtimes", async (req, res) => {
  try {
    const movieIdParam = req.query.movieId as string | undefined;

    if (movieIdParam !== undefined) {
      const movieId = Number(movieIdParam);
      if (Number.isNaN(movieId)) {
        res.status(400).json({ error: "Invalid movieId" });
        return;
      }

      const rows = await db
        .select({
          showtime: showtimesTable,
          cinema: cinemasTable,
        })
        .from(showtimesTable)
        .innerJoin(cinemasTable, eq(showtimesTable.cinemaId, cinemasTable.id))
        .where(eq(showtimesTable.movieId, movieId));

      res.json(
        rows.map(({ showtime, cinema }) => ({
          id: String(showtime.id),
          movieId: String(showtime.movieId),
          cinemaId: String(showtime.cinemaId),
          date: showtime.date,
          time: showtime.time,
          price: Number(showtime.price),
          availableSeats: showtime.availableSeats,
          totalSeats: showtime.totalSeats,
          cinema: {
            id: String(cinema.id),
            name: cinema.name,
            address: cinema.address,
          },
        }))
      );
      return;
    }

    // No filter — return all
    const rows = await db
      .select({
        showtime: showtimesTable,
        cinema: cinemasTable,
      })
      .from(showtimesTable)
      .innerJoin(cinemasTable, eq(showtimesTable.cinemaId, cinemasTable.id));

    res.json(
      rows.map(({ showtime, cinema }) => ({
        id: String(showtime.id),
        movieId: String(showtime.movieId),
        cinemaId: String(showtime.cinemaId),
        date: showtime.date,
        time: showtime.time,
        price: Number(showtime.price),
        availableSeats: showtime.availableSeats,
        totalSeats: showtime.totalSeats,
        cinema: {
          id: String(cinema.id),
          name: cinema.name,
          address: cinema.address,
        },
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch showtimes" });
  }
});

// GET /showtimes/:id
router.get("/showtimes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid showtime id" });
      return;
    }

    const rows = await db
      .select({
        showtime: showtimesTable,
        cinema: cinemasTable,
        movie: moviesTable,
      })
      .from(showtimesTable)
      .innerJoin(cinemasTable, eq(showtimesTable.cinemaId, cinemasTable.id))
      .innerJoin(moviesTable, eq(showtimesTable.movieId, moviesTable.id))
      .where(eq(showtimesTable.id, id))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({ error: "Showtime not found" });
      return;
    }

    const { showtime, cinema, movie } = rows[0];

    res.json({
      id: String(showtime.id),
      movieId: String(showtime.movieId),
      cinemaId: String(showtime.cinemaId),
      date: showtime.date,
      time: showtime.time,
      price: Number(showtime.price),
      availableSeats: showtime.availableSeats,
      totalSeats: showtime.totalSeats,
      cinema: {
        id: String(cinema.id),
        name: cinema.name,
        address: cinema.address,
      },
      movie: {
        id: String(movie.id),
        title: movie.title,
        poster: movie.posterUrl ?? "",
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch showtime" });
  }
});

export default router;
