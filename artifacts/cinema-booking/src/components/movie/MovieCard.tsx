import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, Star } from "lucide-react";
import { Movie } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export function MovieCard({ movie, index = 0 }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300"
      data-testid={`card-movie-${movie.id}`}
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground">
            {movie.rating}
          </Badge>
        </div>
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
        
        <Link href={`/movies/${movie.id}`}>
          <Button className="w-full transition-all group-hover:bg-primary/90">
            {movie.status === 'now-showing' ? 'Book Now' : 'View Details'}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
