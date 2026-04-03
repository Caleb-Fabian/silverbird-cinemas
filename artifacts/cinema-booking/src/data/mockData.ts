export interface Movie {
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
  status: 'now-showing' | 'coming-soon';
  releaseDate: string;
}

export interface Cinema {
  id: string;
  name: string;
  address: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  cinemaId: string;
  date: string;
  time: string;
  availableSeats: number;
  totalSeats: number;
}

export interface Booking {
  id: string;
  customerName: string;
  movieId: string;
  cinemaId: string;
  showtimeId: string;
  seats: string[];
  totalPrice: number;
  date: string;
  status: 'confirmed' | 'cancelled';
}

export const mockMovies: Movie[] = [
  {
    id: "m1",
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    genre: ["Action", "Adventure", "Sci-Fi"],
    duration: 166,
    rating: "PG-13",
    imdbScore: 8.8,
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    posterFallback: "https://picsum.photos/seed/m1/400/600",
    banner: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    bannerFallback: "https://picsum.photos/seed/m1-banner/1920/600",
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
    status: "now-showing",
    releaseDate: "2024-03-01"
  },
  {
    id: "m2",
    title: "Oppenheimer",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    genre: ["Biography", "Drama", "History"],
    duration: 180,
    rating: "R",
    imdbScore: 8.4,
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"],
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    posterFallback: "https://picsum.photos/seed/m2/400/600",
    banner: "https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    bannerFallback: "https://picsum.photos/seed/m2-banner/1920/600",
    trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
    status: "now-showing",
    releaseDate: "2023-07-21"
  },
  {
    id: "m3",
    title: "Furiosa: A Mad Max Saga",
    description: "The origin story of renegade warrior Furiosa before her encounter and teamup with Mad Max.",
    genre: ["Action", "Adventure", "Sci-Fi"],
    duration: 148,
    rating: "R",
    imdbScore: 7.9,
    director: "George Miller",
    cast: ["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke"],
    poster: "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    posterFallback: "https://picsum.photos/seed/m3/400/600",
    banner: "https://image.tmdb.org/t/p/w1280/jtAI6OJIWLWiRItNSZoWjrsUtmi.jpg",
    bannerFallback: "https://picsum.photos/seed/m3-banner/1920/600",
    trailerUrl: "https://www.youtube.com/embed/XJMuhwV5pKQ",
    status: "coming-soon",
    releaseDate: "2024-05-24"
  },
  {
    id: "m4",
    title: "Inside Out 2",
    description: "Follows Riley, in her teenage years, encountering new emotions.",
    genre: ["Animation", "Adventure", "Comedy"],
    duration: 96,
    rating: "PG",
    imdbScore: 8.0,
    director: "Kelsey Mann",
    cast: ["Amy Poehler", "Phyllis Smith", "Lewis Black"],
    poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    posterFallback: "https://picsum.photos/seed/m4/400/600",
    banner: "https://image.tmdb.org/t/p/w1280/tg83U7A6HoJpKElEEUE7EFLqzMR.jpg",
    bannerFallback: "https://picsum.photos/seed/m4-banner/1920/600",
    trailerUrl: "https://www.youtube.com/embed/LEjhY15eCx0",
    status: "coming-soon",
    releaseDate: "2024-06-14"
  },
  {
    id: "m5",
    title: "Deadpool & Wolverine",
    description: "Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy.",
    genre: ["Action", "Comedy", "Sci-Fi"],
    duration: 127,
    rating: "R",
    imdbScore: 8.2,
    director: "Shawn Levy",
    cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin"],
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    posterFallback: "https://picsum.photos/seed/m5/400/600",
    banner: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    bannerFallback: "https://picsum.photos/seed/m5-banner/1920/600",
    trailerUrl: "https://www.youtube.com/embed/73_1biukkMQ",
    status: "now-showing",
    releaseDate: "2024-07-26"
  },
  {
    id: "m6",
    title: "Gladiator II",
    description: "Follows Lucius, the son of Maximus' love Lucilla, after Maximus' death.",
    genre: ["Action", "Adventure", "Drama"],
    duration: 150,
    rating: "R",
    imdbScore: 7.8,
    director: "Ridley Scott",
    cast: ["Paul Mescal", "Denzel Washington", "Pedro Pascal"],
    poster: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    posterFallback: "https://picsum.photos/seed/m6/400/600",
    banner: "https://image.tmdb.org/t/p/w1280/euYIwmwkmz95mnXvufEmbnd8qrd.jpg",
    bannerFallback: "https://picsum.photos/seed/m6-banner/1920/600",
    trailerUrl: "https://www.youtube.com/embed/4rgYUipGJNo",
    status: "coming-soon",
    releaseDate: "2024-11-22"
  },
  {
    id: "m7",
    title: "Kingdom of the Planet of the Apes",
    description: "Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he's been taught about the past.",
    genre: ["Action", "Adventure", "Sci-Fi"],
    duration: 145,
    rating: "PG-13",
    imdbScore: 7.2,
    director: "Wes Ball",
    cast: ["Owen Teague", "Freya Allan", "Kevin Durand"],
    poster: "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    posterFallback: "https://picsum.photos/seed/m7/400/600",
    banner: "https://image.tmdb.org/t/p/w1280/fqv8v6AycXKsivp1T5yKtLbGXce.jpg",
    bannerFallback: "https://picsum.photos/seed/m7-banner/1920/600",
    trailerUrl: "https://www.youtube.com/embed/KdqHQJA6IPI",
    status: "now-showing",
    releaseDate: "2024-05-10"
  },
  {
    id: "m8",
    title: "A Quiet Place: Day One",
    description: "Experience the day the world went quiet.",
    genre: ["Drama", "Horror", "Sci-Fi"],
    duration: 100,
    rating: "PG-13",
    imdbScore: 6.9,
    director: "Michael Sarnoski",
    cast: ["Lupita Nyong'o", "Joseph Quinn", "Alex Wolff"],
    poster: "https://image.tmdb.org/t/p/w500/fFokPdCFPBfFGlq67GJxiGnMnzH.jpg",
    posterFallback: "https://picsum.photos/seed/m8/400/600",
    banner: "https://image.tmdb.org/t/p/w1280/mSMkIe74gbXFkGNNSNV1iyOT9Ep.jpg",
    bannerFallback: "https://picsum.photos/seed/m8-banner/1920/600",
    trailerUrl: "https://www.youtube.com/embed/YPY7J-flzE8",
    status: "now-showing",
    releaseDate: "2024-06-28"
  }
];

export const mockCinemas: Cinema[] = [
  {
    id: "c1",
    name: "Silverbird Galleria Lagos",
    address: "133 Ahmadu Bello Way, Victoria Island, Lagos"
  },
  {
    id: "c2",
    name: "Silverbird Abuja",
    address: "Silverbird Galleria, 1161 Memorial Drive, Central Business District, Abuja"
  },
  {
    id: "c3",
    name: "Silverbird Port Harcourt",
    address: "GRA Phase 2, Peter Odili Road, Port Harcourt, Rivers State"
  }
];

export const mockShowtimes: Showtime[] = [
  { id: "s1", movieId: "m1", cinemaId: "c1", date: "2024-11-20", time: "18:00", availableSeats: 45, totalSeats: 120 },
  { id: "s2", movieId: "m1", cinemaId: "c1", date: "2024-11-20", time: "21:30", availableSeats: 12, totalSeats: 120 },
  { id: "s3", movieId: "m1", cinemaId: "c2", date: "2024-11-20", time: "19:15", availableSeats: 80, totalSeats: 100 },
  { id: "s4", movieId: "m2", cinemaId: "c1", date: "2024-11-20", time: "20:00", availableSeats: 5, totalSeats: 120 },
  { id: "s5", movieId: "m5", cinemaId: "c3", date: "2024-11-20", time: "17:45", availableSeats: 60, totalSeats: 80 },
  { id: "s6", movieId: "m5", cinemaId: "c3", date: "2024-11-20", time: "20:30", availableSeats: 0, totalSeats: 80 },
];

export const mockBookings: Booking[] = [
  { id: "b1", customerName: "Amaka Okafor", movieId: "m1", cinemaId: "c1", showtimeId: "s1", seats: ["F5", "F6"], totalPrice: 7000, date: "2024-11-19", status: "confirmed" },
  { id: "b2", customerName: "Chidi Nwosu", movieId: "m2", cinemaId: "c1", showtimeId: "s4", seats: ["D10", "D11", "D12"], totalPrice: 10500, date: "2024-11-19", status: "confirmed" },
  { id: "b3", customerName: "Fatima Abdullahi", movieId: "m5", cinemaId: "c3", showtimeId: "s6", seats: ["G1"], totalPrice: 3500, date: "2024-11-18", status: "cancelled" },
  { id: "b4", customerName: "Emeka Adeleke", movieId: "m1", cinemaId: "c2", showtimeId: "s3", seats: ["H8", "H9"], totalPrice: 7000, date: "2024-11-18", status: "confirmed" },
  { id: "b5", customerName: "Ngozi Okonkwo", movieId: "m1", cinemaId: "c1", showtimeId: "s2", seats: ["K1", "K2", "K3", "K4"], totalPrice: 14000, date: "2024-11-17", status: "confirmed" },
  { id: "b6", customerName: "Tunde Bakare", movieId: "m5", cinemaId: "c3", showtimeId: "s5", seats: ["B3", "B4"], totalPrice: 7000, date: "2024-11-17", status: "confirmed" },
  { id: "b7", customerName: "Chisom Eze", movieId: "m7", cinemaId: "c2", showtimeId: "s3", seats: ["E6", "E7", "E8"], totalPrice: 10500, date: "2024-11-16", status: "confirmed" },
  { id: "b8", customerName: "Aisha Musa", movieId: "m2", cinemaId: "c1", showtimeId: "s4", seats: ["C2"], totalPrice: 3500, date: "2024-11-16", status: "confirmed" },
  { id: "b9", customerName: "Obinna Umeh", movieId: "m8", cinemaId: "c3", showtimeId: "s5", seats: ["J9", "J10"], totalPrice: 7000, date: "2024-11-15", status: "cancelled" },
  { id: "b10", customerName: "Yewande Adeyemi", movieId: "m1", cinemaId: "c1", showtimeId: "s1", seats: ["A1", "A2", "A3"], totalPrice: 10500, date: "2024-11-15", status: "confirmed" },
];
