import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { fetchMovie, fetchShowtimesByMovie } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, Calendar, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: movie, isLoading: movieLoading, isError: movieError } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovie(id),
    enabled: !!id,
  });

  const { data: showtimes = [] } = useQuery({
    queryKey: ["showtimes", id],
    queryFn: () => fetchShowtimesByMovie(id),
    enabled: !!id && movie?.status === "now-showing",
  });

  if (movieLoading) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Loading movie...</p>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
        <Button onClick={() => setLocation("/movies")}>Back to Movies</Button>
      </div>
    );
  }

  // Group showtimes by cinemaId
  const showtimesByCinema = showtimes.reduce((acc, showtime) => {
    if (!acc[showtime.cinemaId]) acc[showtime.cinemaId] = [];
    acc[showtime.cinemaId].push(showtime);
    return acc;
  }, {} as Record<string, typeof showtimes>);

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <Navbar />

      {/* Banner */}
      <div className="relative h-[50vh] min-h-100 w-full">
        <img
          src={movie.banner}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const t = e.currentTarget;
            if (t.src !== movie.bannerFallback) t.src = movie.bannerFallback;
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/20" />
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 -mt-32 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4"
          >
            <div className="rounded-xl overflow-hidden shadow-xl border border-border/50">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-auto aspect-2/3 object-cover"
                onError={(e) => {
                  const t = e.currentTarget;
                  if (t.src !== movie.posterFallback) t.src = movie.posterFallback;
                }}
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline" size="lg">
                  <PlayCircle className="mr-2 h-5 w-5" /> Watch Trailer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90 border-none">
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={movie.trailerUrl}
                    title={`${movie.title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="text-sm px-3 py-1 bg-primary/10 text-primary border-primary/20">
                {movie.status === "now-showing" ? "Now Showing" : "Coming Soon"}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {movie.rating}
              </Badge>
              <div className="flex items-center gap-1 text-sm font-medium text-amber-500 ml-2">
                <Star className="h-4 w-4 fill-current" />
                {movie.imdbScore}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {movie.duration} min
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(movie.releaseDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              </div>
              <div className="flex gap-2">
                {movie.genre.map(g => (
                  <span key={g} className="px-2 py-0.5 bg-muted rounded-full text-xs">{g}</span>
                ))}
              </div>
            </div>

            <p className="text-lg leading-relaxed mb-8">{movie.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <div>
                <h3 className="font-semibold text-muted-foreground mb-2 text-sm uppercase tracking-wider">Director</h3>
                <p className="font-medium">{movie.director}</p>
              </div>
              <div>
                <h3 className="font-semibold text-muted-foreground mb-2 text-sm uppercase tracking-wider">Cast</h3>
                <p className="font-medium">{movie.cast.join(", ")}</p>
              </div>
            </div>

            {/* Showtimes */}
            {movie.status === "now-showing" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TicketIcon className="h-6 w-6 text-primary" />
                  Book Tickets
                </h2>

                {Object.keys(showtimesByCinema).length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {Object.entries(showtimesByCinema).map(([cinemaId, cts]) => {
                      const cinema = cts[0]?.cinema;
                      if (!cinema) return null;

                      return (
                        <div key={cinemaId} className="bg-card border rounded-xl p-6 shadow-sm">
                          <div className="flex items-start gap-3 mb-4">
                            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-bold text-lg">{cinema.name}</h3>
                              <p className="text-sm text-muted-foreground">{cinema.address}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {cts.map(st => (
                              <Link key={st.id} href={`/booking/seats/${movie.id}/${st.id}`}>
                                <Button
                                  variant={st.availableSeats > 0 ? "outline" : "secondary"}
                                  className={`flex flex-col h-auto py-2 px-4 ${st.availableSeats === 0 ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5"}`}
                                  disabled={st.availableSeats === 0}
                                  data-testid={`btn-showtime-${st.id}`}
                                >
                                  <span className="font-bold text-base">{st.time}</span>
                                  <span className="text-xs opacity-70">
                                    {st.availableSeats > 0 ? `${st.availableSeats} seats left` : "Sold Out"}
                                  </span>
                                </Button>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground bg-muted p-4 rounded-lg text-center">
                    No showtimes available currently.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function TicketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
