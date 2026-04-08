import { Router, type IRouter } from "express";
import { db, moviesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function transformMovie(movie: typeof moviesTable.$inferSelect) {
  let genre: string[] = [];
  if (movie.genre) {
    genre = movie.genre.split(",").map((g) => g.trim()).filter(Boolean);
  }

  let cast: string[] = [];
  if (movie.cast) {
    try {
      const parsed = JSON.parse(movie.cast);
      cast = Array.isArray(parsed) ? parsed : [movie.cast];
    } catch {
      cast = movie.cast.split(",").map((c) => c.trim()).filter(Boolean);
    }
  }

  return {
    id: String(movie.id),
    title: movie.title,
    description: movie.description,
    genre,
    duration: movie.duration,
    rating: movie.rating,
    imdbScore: movie.imdbScore ? Number(movie.imdbScore) : 0,
    director: movie.director ?? "",
    cast,
    poster: movie.posterUrl ?? "",
    posterFallback: "",
    banner: movie.bannerUrl ?? "",
    bannerFallback: "",
    trailerUrl: movie.trailerUrl ?? "",
    status: movie.status as "now-showing" | "coming-soon",
    releaseDate: movie.releaseDate,
  };
}

router.get("/movies", async (_req, res) => {
  try {
    const movies = await db
      .select()
      .from(moviesTable)
      .where(eq(moviesTable.isActive, 1));

    res.json(movies.map(transformMovie));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid movie id" });
      return;
    }

    const [movie] = await db
      .select()
      .from(moviesTable)
      .where(eq(moviesTable.id, id))
      .limit(1);

    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    res.json(transformMovie(movie));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

export default router;
