import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMovies, createMovie, deleteMovie, type MovieCreateBody } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash2 } from "lucide-react";

const emptyForm: MovieCreateBody = {
  title: "",
  description: "",
  genre: "",
  duration: undefined,
  rating: "",
  imdbScore: undefined,
  director: "",
  cast: "",
  posterUrl: "",
  bannerUrl: "",
  trailerUrl: "",
  status: "now-showing",
  releaseDate: "",
};

export default function AdminMovies() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<MovieCreateBody>(emptyForm);

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });

  const addMutation = useMutation({
    mutationFn: createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setOpen(false);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    addMutation.mutate({
      ...form,
      duration: form.duration ? Number(form.duration) : undefined,
      imdbScore: form.imdbScore ? Number(form.imdbScore) : undefined,
    });
  }

  function set(field: keyof MovieCreateBody, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Movies Management</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="btn-add-movie">
              <Plus className="mr-2 h-4 w-4" /> Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Movie title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Short description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="120"
                    value={form.duration ?? ""}
                    onChange={(e) => set("duration", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    placeholder="PG-13"
                    value={form.rating}
                    onChange={(e) => set("rating", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="genre">Genre (comma-separated)</Label>
                  <Input
                    id="genre"
                    placeholder="Action, Drama"
                    value={form.genre}
                    onChange={(e) => set("genre", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="imdb">IMDB Score</Label>
                  <Input
                    id="imdb"
                    type="number"
                    step="0.1"
                    placeholder="7.5"
                    value={form.imdbScore ?? ""}
                    onChange={(e) => set("imdbScore", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="director">Director</Label>
                <Input
                  id="director"
                  placeholder="Director name"
                  value={form.director}
                  onChange={(e) => set("director", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cast">Cast (comma-separated)</Label>
                <Input
                  id="cast"
                  placeholder="Actor 1, Actor 2"
                  value={form.cast}
                  onChange={(e) => set("cast", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="poster">Poster URL</Label>
                <Input
                  id="poster"
                  placeholder="https://..."
                  value={form.posterUrl}
                  onChange={(e) => set("posterUrl", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="banner">Banner URL</Label>
                <Input
                  id="banner"
                  placeholder="https://..."
                  value={form.bannerUrl}
                  onChange={(e) => set("bannerUrl", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trailer">Trailer URL</Label>
                <Input
                  id="trailer"
                  placeholder="https://www.youtube.com/embed/..."
                  value={form.trailerUrl}
                  onChange={(e) => set("trailerUrl", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => set("status", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now-showing">Now Showing</SelectItem>
                      <SelectItem value="coming-soon">Coming Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="releaseDate">Release Date</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={form.releaseDate}
                    onChange={(e) => set("releaseDate", e.target.value)}
                  />
                </div>
              </div>
              {addMutation.error && (
                <p className="text-sm text-destructive">{(addMutation.error as Error).message}</p>
              )}
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? "Saving…" : "Save Movie"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Poster</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filteredMovies.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No movies found
                </TableCell>
              </TableRow>
            )}
            {filteredMovies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-10 h-14 rounded bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                      No img
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{movie.title}</TableCell>
                <TableCell>{movie.genre.slice(0, 2).join(", ")}</TableCell>
                <TableCell>{movie.duration ? `${movie.duration}m` : "—"}</TableCell>
                <TableCell>
                  <Badge variant={movie.status === "now-showing" ? "default" : "secondary"}>
                    {movie.status === "now-showing" ? "Now Showing" : "Coming Soon"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      if (confirm(`Delete "${movie.title}"?`)) {
                        deleteMutation.mutate(movie.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
