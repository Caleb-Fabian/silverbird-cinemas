// Backend origin, e.g. https://your-app.onrender.com. Empty in dev, where Vite proxies /api.
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const TOKEN_KEY = "adminToken";
export const ADMIN_LOGOUT_EVENT = "admin-logout";

export function getAdminToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable; the session just won't persist
  }
}

export async function apiFetch(path: string, init?: RequestInit) {
  const token = getAdminToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  // Expired or invalid admin session: drop it so the admin is sent back to login
  if (res.status === 401 && token) {
    setAdminToken(null);
    window.dispatchEvent(new Event(ADMIN_LOGOUT_EVENT));
  }
  return res;
}

export async function adminLogin(email: string, password: string): Promise<string> {
  const res = await apiFetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Login failed");
  }
  return ((await res.json()) as { token: string }).token;
}

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
  const res = await apiFetch("/api/movies");
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function fetchMovie(id: string): Promise<MovieAPI> {
  const res = await apiFetch(`/api/movies/${id}`);
  if (!res.ok) throw new Error("Failed to fetch movie");
  return res.json();
}

export async function fetchShowtimesByMovie(movieId: string): Promise<ShowtimeAPI[]> {
  const res = await apiFetch(`/api/showtimes?movieId=${movieId}`);
  if (!res.ok) throw new Error("Failed to fetch showtimes");
  return res.json();
}

export async function fetchShowtime(id: string): Promise<ShowtimeAPI> {
  const res = await apiFetch(`/api/showtimes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch showtime");
  return res.json();
}

export async function createBooking(body: BookingCreateBody): Promise<BookingAPI> {
  const res = await apiFetch("/api/bookings", {
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

// ── Admin API types ────────────────────────────────────────────────────────────

export interface AdminBookingAPI {
  id: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  selectedSeats: string[];
  totalAmount: number;
  status: string;
  createdAt: string;
  movie: { id: string; title: string; poster: string };
  cinema: { id: string; name: string };
  showtime: { date: string; time: string };
}

export interface DashboardAPI {
  totalRevenue: number;
  totalTickets: number;
  activeMovies: number;
  totalMovies: number;
  totalShowtimes: number;
  recentBookings: {
    id: string;
    bookingReference: string;
    customerName: string;
    totalAmount: number;
    status: string;
    movieTitle: string;
    createdAt: string;
  }[];
}

export interface MovieCreateBody {
  title: string;
  description?: string;
  genre?: string;
  duration?: number;
  rating?: string;
  imdbScore?: number;
  director?: string;
  cast?: string;
  posterUrl?: string;
  bannerUrl?: string;
  trailerUrl?: string;
  status?: "now-showing" | "coming-soon";
  releaseDate?: string;
}

export interface ShowtimeCreateBody {
  movieId: number | string;
  cinemaId: number | string;
  date: string;
  time: string;
  price: number | string;
  totalSeats?: number;
}

// ── Admin API functions ────────────────────────────────────────────────────────

export async function fetchCinemas(): Promise<CinemaAPI[]> {
  const res = await apiFetch("/api/cinemas");
  if (!res.ok) throw new Error("Failed to fetch cinemas");
  return res.json();
}

export async function fetchDashboard(): Promise<DashboardAPI> {
  const res = await apiFetch("/api/dashboard");
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json();
}

export async function fetchAllBookings(): Promise<AdminBookingAPI[]> {
  const res = await apiFetch("/api/bookings");
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

export async function createMovie(body: MovieCreateBody): Promise<MovieAPI> {
  const res = await apiFetch("/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Failed to create movie");
  }
  return res.json();
}

export async function updateMovie(id: string, body: Partial<MovieCreateBody>): Promise<MovieAPI> {
  const res = await apiFetch(`/api/movies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Failed to update movie");
  }
  return res.json();
}

export async function deleteMovie(id: string): Promise<void> {
  const res = await apiFetch(`/api/movies/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete movie");
}

export async function createShowtime(body: ShowtimeCreateBody): Promise<ShowtimeAPI> {
  const res = await apiFetch("/api/showtimes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Failed to create showtime");
  }
  return res.json();
}

export async function deleteShowtime(id: string): Promise<void> {
  const res = await apiFetch(`/api/showtimes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete showtime");
}
