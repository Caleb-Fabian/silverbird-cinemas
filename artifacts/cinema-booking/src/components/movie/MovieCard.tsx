import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, Star } from "lucide-react";
import { Movie } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  onSelect?: (movie: Movie) => void;
}

export function MovieCard({ movie, index = 0, onSelect }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
      data-testid={`card-movie-${movie.id}`}
      onClick={() => onSelect?.(movie)}
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-muted relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== movie.posterFallback) {
              target.src = movie.posterFallback;
            }
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground">
            {movie.rating}
          </Badge>
        </div>
        {onSelect && (
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-white text-sm font-semibold bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
              Preview
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg leading-tight line-clamp-1" title={movie.title}>
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 text-sm font-medium text-amber-500 shrink-0">
            <Star className="h-3.5 w-3.5 fill-current" />
            {movie.imdbScore}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genre.slice(0, 2).map((g) => (
            <span key={g} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {g}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto mb-4">
          <Clock className="h-4 w-4" />
          <span>{movie.duration} min</span>
        </div>
        
        <Link href={`/movies/${movie.id}`} onClick={(e) => e.stopPropagation()}>
          <Button className="w-full transition-all group-hover:bg-primary/90" data-testid={`btn-book-${movie.id}`}>
            {movie.status === 'now-showing' ? 'Book Now' : 'View Details'}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
