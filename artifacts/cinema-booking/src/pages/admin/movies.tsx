import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  uploadFile,
  type MovieAPI,
  type MovieCreateBody,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";

function MediaUpload({
  id,
  label,
  kind,
  value,
  onChange,
  onUploadingChange,
}: {
  id: string;
  label: string;
  kind: "image" | "video";
  value?: string;
  onChange: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    onUploadingChange(true);
    try {
      onChange(await uploadFile(file));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {value ? (
        <div className="relative w-fit">
          {kind === "image" ? (
            <img src={value} alt={label} className="max-h-40 rounded border" />
          ) : (
            <video src={value} controls className="max-h-48 rounded border" />
          )}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-1 right-1 h-7 w-7"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Input
          id={id}
          type="file"
          accept={kind === "image" ? "image/jpeg,image/png,image/webp,image/gif" : "video/mp4,video/webm,video/quicktime"}
          disabled={uploading}
          onChange={handleFile}
        />
      )}
      {uploading && <p className="text-sm text-muted-foreground">Uploading…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploadingState] = useState<Record<string, boolean>>({});
  const isUploading = Object.values(uploading).some(Boolean);

  function setUploading(field: string, value: boolean) {
    setUploadingState((prev) => ({ ...prev, [field]: value }));
  }

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });

  const saveMutation = useMutation({
    mutationFn: (body: MovieCreateBody) =>
      editingId ? updateMovie(editingId, body) : createMovie(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movie"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setOpen(false);
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setEditingId(null);
      setForm(emptyForm);
      saveMutation.reset();
    }
  }

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    saveMutation.reset();
    setOpen(true);
  }

  function openEdit(movie: MovieAPI) {
    setEditingId(movie.id);
    setForm({
      title: movie.title,
      description: movie.description ?? "",
      genre: movie.genre.join(", "),
      duration: movie.duration || undefined,
      rating: movie.rating ?? "",
      imdbScore: movie.imdbScore || undefined,
      director: movie.director,
      cast: movie.cast.join(", "),
      posterUrl: movie.poster,
      bannerUrl: movie.banner,
      trailerUrl: movie.trailerUrl,
      status: movie.status,
      releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : "",
    });
    saveMutation.reset();
    setOpen(true);
  }

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
    saveMutation.mutate({
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

        <Button data-testid="btn-add-movie" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Movie
        </Button>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Movie" : "Add New Movie"}</DialogTitle>
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
              <MediaUpload
                id="poster"
                label="Poster"
                kind="image"
                value={form.posterUrl}
                onChange={(url) => set("posterUrl", url)}
                onUploadingChange={(v) => setUploading("poster", v)}
              />
              <MediaUpload
                id="banner"
                label="Banner"
                kind="image"
                value={form.bannerUrl}
                onChange={(url) => set("bannerUrl", url)}
                onUploadingChange={(v) => setUploading("banner", v)}
              />
              <MediaUpload
                id="trailer"
                label="Trailer"
                kind="video"
                value={form.trailerUrl}
                onChange={(url) => set("trailerUrl", url)}
                onUploadingChange={(v) => setUploading("trailer", v)}
              />
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
              {saveMutation.error && (
                <p className="text-sm text-destructive">{(saveMutation.error as Error).message}</p>
              )}
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={saveMutation.isPending || isUploading}>
                  {isUploading ? "Uploading…" : saveMutation.isPending ? "Saving…" : editingId ? "Save Changes" : "Save Movie"}
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
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="Edit movie"
                    onClick={() => openEdit(movie)}
                    data-testid={`btn-edit-movie-${movie.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
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
