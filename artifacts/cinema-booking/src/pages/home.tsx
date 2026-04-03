import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { MovieCard } from "@/components/movie/MovieCard";
import { Movie, mockMovies } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, ArrowRight } from "lucide-react";

export default function Home() {
  const nowShowing = mockMovies.filter(m => m.status === 'now-showing');
  const comingSoon = mockMovies.filter(m => m.status === 'coming-soon');

  const [featuredMovie, setFeaturedMovie] = useState<Movie>(nowShowing[0]);

  const handleSelectMovie = (movie: Movie) => {
    if (movie.id !== featuredMovie.id) {
      setFeaturedMovie(movie);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[75vh] min-h-[500px] w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredMovie.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={featuredMovie.banner}
                alt={featuredMovie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== featuredMovie.bannerFallback) {
                    target.src = featuredMovie.bannerFallback;
                  }
                }}
              />
              {/* Reduced overlay opacity for more visible banner */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
            </motion.div>
          </AnimatePresence>
          
          <div className="container relative h-full flex items-end pb-20 px-4 md:px-6 mx-auto">
            <AnimatePresence mode="wait">
              <motion.div 
                key={featuredMovie.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                className="max-w-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                    {featuredMovie.status === 'now-showing' ? 'Now Playing' : 'Coming Soon'}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-400 font-semibold drop-shadow">
                    ★ {featuredMovie.imdbScore}
                  </span>
                  <span className="text-sm text-white/70 font-medium">
                    {featuredMovie.genre.slice(0, 2).join(' · ')}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white tracking-tight drop-shadow-lg">
                  {featuredMovie.title}
                </h1>
                <p className="text-base md:text-lg text-white/80 mb-8 line-clamp-2 max-w-xl drop-shadow">
                  {featuredMovie.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href={`/movies/${featuredMovie.id}`}>
                    <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/30" data-testid="btn-hero-book">
                      Book Tickets
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base rounded-full bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
                    data-testid="btn-hero-trailer"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" /> Watch Trailer
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mini poster strip at bottom right */}
          <div className="absolute bottom-4 right-4 hidden lg:flex items-center gap-2">
            {nowShowing.slice(0, 4).map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleSelectMovie(movie)}
                className={`relative h-16 w-11 rounded overflow-hidden border-2 transition-all duration-200 ${
                  featuredMovie.id === movie.id
                    ? 'border-primary scale-110 shadow-lg shadow-primary/40'
                    : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                }`}
                data-testid={`btn-mini-poster-${movie.id}`}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== movie.posterFallback) {
                      target.src = movie.posterFallback;
                    }
                  }}
                />
              </button>
            ))}
          </div>
        </section>

        {/* Now Showing Section */}
        <section className="py-16 md:py-20 container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Now Showing</h2>
              <p className="text-muted-foreground">Click a movie to preview it above, or hit Book Now to get tickets.</p>
            </div>
            <Link href="/movies" className="hidden md:flex">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nowShowing.slice(0, 4).map((movie, idx) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                index={idx}
                onSelect={handleSelectMovie}
              />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center md:hidden">
            <Link href="/movies">
              <Button variant="outline" className="w-full">View All Movies</Button>
            </Link>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Coming Soon</h2>
              <p className="text-muted-foreground">Catch a glimpse of upcoming blockbusters.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {comingSoon.slice(0, 4).map((movie, idx) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  index={idx}
                  onSelect={handleSelectMovie}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Silverbird Cinemas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
