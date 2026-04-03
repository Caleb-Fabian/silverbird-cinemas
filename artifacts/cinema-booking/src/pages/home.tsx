import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { MovieCard } from "@/components/movie/MovieCard";
import { mockMovies } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PlayCircle, ArrowRight } from "lucide-react";

export default function Home() {
  const [location, setLocation] = useLocation();
  const featuredMovie = mockMovies.find(m => m.status === 'now-showing');
  const nowShowing = mockMovies.filter(m => m.status === 'now-showing').slice(0, 4);
  const comingSoon = mockMovies.filter(m => m.status === 'coming-soon').slice(0, 4);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        {featuredMovie && (
          <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src={featuredMovie.banner} 
                alt={featuredMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
            </div>
            
            <div className="container relative h-full flex items-end pb-20 px-4 md:px-6 mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                    Now Playing
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500 font-medium">
                    ★ {featuredMovie.imdbScore}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-foreground tracking-tight">
                  {featuredMovie.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 line-clamp-2 md:line-clamp-3">
                  {featuredMovie.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href={`/movies/${featuredMovie.id}`}>
                    <Button size="lg" className="h-12 px-8 text-lg rounded-full">
                      Book Tickets
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full bg-background/20 backdrop-blur-md border-white/20 hover:bg-background/40">
                    <PlayCircle className="mr-2 h-5 w-5" /> Watch Trailer
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Now Showing Section */}
        <section className="py-16 md:py-24 container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Now Showing</h2>
              <p className="text-muted-foreground">Book tickets for movies currently in theaters.</p>
            </div>
            <Link href="/movies" className="hidden md:flex">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nowShowing.map((movie, idx) => (
              <MovieCard key={movie.id} movie={movie} index={idx} />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center md:hidden">
            <Link href="/movies">
              <Button variant="outline" className="w-full">View All Movies</Button>
            </Link>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Coming Soon</h2>
              <p className="text-muted-foreground">Catch a glimpse of upcoming blockbusters.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {comingSoon.map((movie, idx) => (
                <MovieCard key={movie.id} movie={movie} index={idx} />
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