import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { MovieCard } from "@/components/movie/MovieCard";
import { fetchMovies } from "@/lib/api";
import { mockMovies } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function Movies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: apiMovies } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });

  const movies = apiMovies && apiMovies.length > 0 ? apiMovies : mockMovies;

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || movie.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-6">Explore Movies</h1>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movies..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-movies"
              />
            </div>

            <Tabs defaultValue="all" onValueChange={setFilter} className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto grid grid-cols-3">
                <TabsTrigger value="all" data-testid="tab-filter-all">All</TabsTrigger>
                <TabsTrigger value="now-showing" data-testid="tab-filter-now-showing">Now Showing</TabsTrigger>
                <TabsTrigger value="coming-soon" data-testid="tab-filter-coming-soon">Coming Soon</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie, idx) => (
              <MovieCard key={movie.id} movie={movie} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No movies found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
