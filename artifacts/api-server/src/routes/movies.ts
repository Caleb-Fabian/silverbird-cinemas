import { Router, type IRouter } from "express";
import { db, moviesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

export function transformMovie(movie: typeof moviesTable.$inferSelect) {
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
    const movies = await db.select().from(moviesTable).where(eq(moviesTable.isActive, 1));
    res.json(movies.map(transformMovie));
  } catch {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ error: "Invalid movie id" }); return; }
    const [movie] = await db.select().from(moviesTable).where(eq(moviesTable.id, id)).limit(1);
    if (!movie) { res.status(404).json({ error: "Movie not found" }); return; }
    res.json(transformMovie(movie));
  } catch {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

router.post("/movies", async (req, res) => {
  try {
    const { title, description, genre, duration, rating, imdbScore, director, cast, posterUrl, bannerUrl, trailerUrl, status, releaseDate } = req.body;
    if (!title || !description || !genre || !duration || !rating || !releaseDate) {
      res.status(400).json({ error: "Missing required fields" }); return;
    }
    const castJson = Array.isArray(cast) ? JSON.stringify(cast) : cast ?? null;
    const [movie] = await db.insert(moviesTable).values({
      title, description, genre, duration: Number(duration), rating,
      imdbScore: imdbScore ? String(imdbScore) : null,
      director: director ?? null,
      cast: castJson,
      posterUrl: posterUrl ?? null,
      bannerUrl: bannerUrl ?? null,
      trailerUrl: trailerUrl ?? null,
      status: status ?? "now-showing",
      releaseDate,
      isActive: 1,
    }).returning();
    res.status(201).json(transformMovie(movie));
  } catch {
    res.status(500).json({ error: "Failed to create movie" });
  }
});

router.put("/movies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ error: "Invalid movie id" }); return; }
    const { title, description, genre, duration, rating, imdbScore, director, cast, posterUrl, bannerUrl, trailerUrl, status, releaseDate } = req.body;
    const castJson = Array.isArray(cast) ? JSON.stringify(cast) : cast ?? undefined;
    const [movie] = await db.update(moviesTable).set({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(genre !== undefined && { genre }),
      ...(duration !== undefined && { duration: Number(duration) }),
      ...(rating !== undefined && { rating }),
      ...(imdbScore !== undefined && { imdbScore: String(imdbScore) }),
      ...(director !== undefined && { director }),
      ...(castJson !== undefined && { cast: castJson }),
      ...(posterUrl !== undefined && { posterUrl }),
      ...(bannerUrl !== undefined && { bannerUrl }),
      ...(trailerUrl !== undefined && { trailerUrl }),
      ...(status !== undefined && { status }),
      ...(releaseDate !== undefined && { releaseDate }),
    }).where(eq(moviesTable.id, id)).returning();
    if (!movie) { res.status(404).json({ error: "Movie not found" }); return; }
    res.json(transformMovie(movie));
  } catch {
    res.status(500).json({ error: "Failed to update movie" });
  }
});

router.delete("/movies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) { res.status(400).json({ error: "Invalid movie id" }); return; }
    await db.update(moviesTable).set({ isActive: 0 }).where(eq(moviesTable.id, id));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete movie" });
  }
});

export default router;
