import { db, cinemasTable, moviesTable, showtimesTable } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  // ── Cinemas ──────────────────────────────────────────────────────────────────
  console.log("Inserting cinemas...");
  const [c1, c2, c3] = await db
    .insert(cinemasTable)
    .values([
      {
        name: "Silverbird Galleria Lagos",
        address: "133 Ahmadu Bello Way, Victoria Island",
        city: "Lagos",
      },
      {
        name: "Silverbird Abuja",
        address: "1161 Memorial Drive, Central Business District",
        city: "Abuja",
      },
      {
        name: "Silverbird Port Harcourt",
        address: "GRA Phase 2, Peter Odili Road",
        city: "Port Harcourt",
      },
    ])
    .returning();

  console.log(`Inserted cinemas: ${c1.id}, ${c2.id}, ${c3.id}`);

  // ── Movies ───────────────────────────────────────────────────────────────────
  console.log("Inserting movies...");
  const movieRows = await db
    .insert(moviesTable)
    .values([
      {
        title: "Dune: Part Two",
        description:
          "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        genre: "Action,Adventure,Sci-Fi",
        duration: 166,
        rating: "PG-13",
        imdbScore: "8.8",
        director: "Denis Villeneuve",
        cast: JSON.stringify(["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"]),
        posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        bannerUrl: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
        trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
        status: "now-showing" as const,
        releaseDate: "2024-03-01",
        isActive: 1,
      },
      {
        title: "Oppenheimer",
        description:
          "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        genre: "Biography,Drama,History",
        duration: 180,
        rating: "R",
        imdbScore: "8.4",
        director: "Christopher Nolan",
        cast: JSON.stringify(["Cillian Murphy", "Emily Blunt", "Matt Damon"]),
        posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        bannerUrl: "https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
        trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
        status: "now-showing" as const,
        releaseDate: "2023-07-21",
        isActive: 1,
      },
      {
        title: "Furiosa: A Mad Max Saga",
        description:
          "The origin story of renegade warrior Furiosa before her encounter and teamup with Mad Max.",
        genre: "Action,Adventure,Sci-Fi",
        duration: 148,
        rating: "R",
        imdbScore: "7.9",
        director: "George Miller",
        cast: JSON.stringify(["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke"]),
        posterUrl: "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
        bannerUrl: "https://image.tmdb.org/t/p/w1280/jtAI6OJIWLWiRItNSZoWjrsUtmi.jpg",
        trailerUrl: "https://www.youtube.com/embed/XJMuhwV5pKQ",
        status: "coming-soon" as const,
        releaseDate: "2024-05-24",
        isActive: 1,
      },
      {
        title: "Inside Out 2",
        description: "Follows Riley, in her teenage years, encountering new emotions.",
        genre: "Animation,Adventure,Comedy",
        duration: 96,
        rating: "PG",
        imdbScore: "8.0",
        director: "Kelsey Mann",
        cast: JSON.stringify(["Amy Poehler", "Phyllis Smith", "Lewis Black"]),
        posterUrl: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
        bannerUrl: "https://image.tmdb.org/t/p/w1280/tg83U7A6HoJpKElEEUE7EFLqzMR.jpg",
        trailerUrl: "https://www.youtube.com/embed/LEjhY15eCx0",
        status: "coming-soon" as const,
        releaseDate: "2024-06-14",
        isActive: 1,
      },
      {
        title: "Deadpool & Wolverine",
        description:
          "Wolverine is recovering from his injuries when he crosses paths with Deadpool. They team up to defeat a common enemy.",
        genre: "Action,Comedy,Sci-Fi",
        duration: 127,
        rating: "R",
        imdbScore: "8.2",
        director: "Shawn Levy",
        cast: JSON.stringify(["Ryan Reynolds", "Hugh Jackman", "Emma Corrin"]),
        posterUrl: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        bannerUrl: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
        trailerUrl: "https://www.youtube.com/embed/73_1biukkMQ",
        status: "now-showing" as const,
        releaseDate: "2024-07-26",
        isActive: 1,
      },
      {
        title: "Gladiator II",
        description: "Follows Lucius, the son of Maximus' love Lucilla, after Maximus' death.",
        genre: "Action,Adventure,Drama",
        duration: 150,
        rating: "R",
        imdbScore: "7.8",
        director: "Ridley Scott",
        cast: JSON.stringify(["Paul Mescal", "Denzel Washington", "Pedro Pascal"]),
        posterUrl: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
        bannerUrl: "https://image.tmdb.org/t/p/w1280/euYIwmwkmz95mnXvufEmbnd8qrd.jpg",
        trailerUrl: "https://www.youtube.com/embed/4rgYUipGJNo",
        status: "coming-soon" as const,
        releaseDate: "2024-11-22",
        isActive: 1,
      },
      {
        title: "Kingdom of the Planet of the Apes",
        description:
          "Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he's been taught about the past.",
        genre: "Action,Adventure,Sci-Fi",
        duration: 145,
        rating: "PG-13",
        imdbScore: "7.2",
        director: "Wes Ball",
        cast: JSON.stringify(["Owen Teague", "Freya Allan", "Kevin Durand"]),
        posterUrl: "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
        bannerUrl: "https://image.tmdb.org/t/p/w1280/fqv8v6AycXKsivp1T5yKtLbGXce.jpg",
        trailerUrl: "https://www.youtube.com/embed/KdqHQJA6IPI",
        status: "now-showing" as const,
        releaseDate: "2024-05-10",
        isActive: 1,
      },
      {
        title: "A Quiet Place: Day One",
        description: "Experience the day the world went quiet.",
        genre: "Drama,Horror,Sci-Fi",
        duration: 100,
        rating: "PG-13",
        imdbScore: "6.9",
        director: "Michael Sarnoski",
        cast: JSON.stringify(["Lupita Nyong'o", "Joseph Quinn", "Alex Wolff"]),
        posterUrl: "https://image.tmdb.org/t/p/w500/fFokPdCFPBfFGlq67GJxiGnMnzH.jpg",
        bannerUrl: "https://image.tmdb.org/t/p/w1280/mSMkIe74gbXFkGNNSNV1iyOT9Ep.jpg",
        trailerUrl: "https://www.youtube.com/embed/YPY7J-flzE8",
        status: "now-showing" as const,
        releaseDate: "2024-06-28",
        isActive: 1,
      },
    ])
    .returning();

  console.log(`Inserted ${movieRows.length} movies`);
  const [m1, m2, , , m5, , m7, m8] = movieRows;

  // ── Showtimes ────────────────────────────────────────────────────────────────
  console.log("Inserting showtimes...");
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  await db.insert(showtimesTable).values([
    { movieId: m1.id, cinemaId: c1.id, date: today, time: "18:00", price: "3500", totalSeats: 120, availableSeats: 120 },
    { movieId: m1.id, cinemaId: c1.id, date: today, time: "21:30", price: "3500", totalSeats: 120, availableSeats: 120 },
    { movieId: m1.id, cinemaId: c2.id, date: today, time: "19:15", price: "3500", totalSeats: 100, availableSeats: 100 },
    { movieId: m2.id, cinemaId: c1.id, date: today, time: "20:00", price: "3500", totalSeats: 120, availableSeats: 120 },
    { movieId: m5.id, cinemaId: c3.id, date: today, time: "17:45", price: "3500", totalSeats: 80, availableSeats: 80 },
    { movieId: m5.id, cinemaId: c3.id, date: today, time: "20:30", price: "3500", totalSeats: 80, availableSeats: 80 },
    { movieId: m7.id, cinemaId: c2.id, date: tomorrow, time: "18:30", price: "3500", totalSeats: 100, availableSeats: 100 },
    { movieId: m8.id, cinemaId: c3.id, date: tomorrow, time: "16:00", price: "3500", totalSeats: 80, availableSeats: 80 },
  ]);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
