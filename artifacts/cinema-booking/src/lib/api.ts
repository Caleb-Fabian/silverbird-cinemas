// Types mirroring the API response shapes

export interface MovieAPI {
  id: string;
  title: string;
  description: string;
  genre: string[];
  duration: number;
  rating: string;
  imdbScore: number;
  director: string;
  cast: string[];
  poster: string;
  posterFallback: string;
  banner: string;
  bannerFallback: string;
  trailerUrl: string;
  status: "now-showing" | "coming-soon";
  releaseDate: string;
}

export interface CinemaAPI {
  id: string;
  name: string;
  address: string;
}

export interface ShowtimeAPI {
  id: string;
  movieId: string;
  cinemaId: string;
  date: string;
  time: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  cinema: CinemaAPI;
  movie?: {
    id: string;
    title: string;
    poster: string;
  };
}

export interface BookingCreateBody {
  showtimeId: number | string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  selectedSeats: string[];
}

export interface BookingAPI {
  id: string;
  showtimeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  selectedSeats: string[];
  totalAmount: number;
  status: string;
  bookingReference: string;
  createdAt: string;
}

export async function fetchMovies(): Promise<MovieAPI[]> {
  const res = await fetch("/api/movies");
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function fetchMovie(id: string): Promise<MovieAPI> {
  const res = await fetch(`/api/movies/${id}`);
  if (!res.ok) throw new Error("Failed to fetch movie");
  return res.json();
}

export async function fetchShowtimesByMovie(movieId: string): Promise<ShowtimeAPI[]> {
  const res = await fetch(`/api/showtimes?movieId=${movieId}`);
  if (!res.ok) throw new Error("Failed to fetch showtimes");
  return res.json();
}

export async function fetchShowtime(id: string): Promise<ShowtimeAPI> {
  const res = await fetch(`/api/showtimes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch showtime");
  return res.json();
}

export async function createBooking(body: BookingCreateBody): Promise<BookingAPI> {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Failed to create booking");
  }
  return res.json();
}
