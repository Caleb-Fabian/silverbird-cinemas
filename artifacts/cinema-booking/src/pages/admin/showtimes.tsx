import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMovies,
  fetchCinemas,
  createShowtime,
  deleteShowtime,
  type ShowtimeCreateBody,
  type ShowtimeAPI,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MapPin, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

async function fetchAllShowtimes(): Promise<ShowtimeAPI[]> {
  const res = await fetch("/api/showtimes");
  if (!res.ok) throw new Error("Failed to fetch showtimes");
  return res.json();
}

const emptyForm: ShowtimeCreateBody = {
  movieId: "",
  cinemaId: "",
  date: "",
  time: "",
  price: "",
  totalSeats: 100,
};

export default function AdminShowtimes() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ShowtimeCreateBody>(emptyForm);

  const { data: showtimes = [], isLoading } = useQuery({
    queryKey: ["showtimes-all"],
    queryFn: fetchAllShowtimes,
  });

  const { data: movies = [] } = useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });

  const { data: cinemas = [] } = useQuery({
    queryKey: ["cinemas"],
    queryFn: fetchCinemas,
  });

  const addMutation = useMutation({
    mutationFn: createShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes-all"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setOpen(false);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes-all"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.movieId || !form.cinemaId || !form.date || !form.time || !form.price) return;
    addMutation.mutate({
      movieId: Number(form.movieId),
      cinemaId: Number(form.cinemaId),
      date: form.date,
      time: form.time,
      price: form.price,
      totalSeats: form.totalSeats ? Number(form.totalSeats) : 100,
    });
  }

  function set(field: keyof ShowtimeCreateBody, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Showtimes Management</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="btn-add-showtime">
              <Plus className="mr-2 h-4 w-4" /> Add Showtime
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add New Showtime</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Movie *</Label>
                <Select
                  value={String(form.movieId)}
                  onValueChange={(v) => set("movieId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select movie" />
                  </SelectTrigger>
                  <SelectContent>
                    {movies.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Cinema *</Label>
                <Select
                  value={String(form.cinemaId)}
                  onValueChange={(v) => set("cinemaId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cinema" />
                  </SelectTrigger>
                  <SelectContent>
                    {cinemas.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={form.time}
                    onChange={(e) => set("time", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="3500"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="seats">Total Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    placeholder="100"
                    value={form.totalSeats ?? ""}
                    onChange={(e) => set("totalSeats", e.target.value)}
                  />
                </div>
              </div>
              {addMutation.error && (
                <p className="text-sm text-destructive">{(addMutation.error as Error).message}</p>
              )}
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? "Saving…" : "Save Showtime"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Movie</TableHead>
              <TableHead>Cinema</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Seats Available</TableHead>
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
            {!isLoading && showtimes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No showtimes yet
                </TableCell>
              </TableRow>
            )}
            {showtimes.map((showtime: ShowtimeAPI) => {
              const occupancyPct =
                showtime.totalSeats > 0
                  ? ((showtime.totalSeats - showtime.availableSeats) / showtime.totalSeats) * 100
                  : 0;
              return (
                <TableRow key={showtime.id}>
                  <TableCell className="font-medium">{showtime.movie?.title ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {showtime.cinema?.name ?? "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{showtime.date}</div>
                    <div className="text-xs text-muted-foreground">{showtime.time}</div>
                  </TableCell>
                  <TableCell>₦{Number(showtime.price).toLocaleString("en-NG")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {showtime.availableSeats} / {showtime.totalSeats}
                      </span>
                      <Badge
                        variant={occupancyPct > 90 ? "destructive" : "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {occupancyPct > 90 ? "Almost Full" : `${Math.round(occupancyPct)}% Booked`}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (confirm("Delete this showtime?")) {
                          deleteMutation.mutate(String(showtime.id));
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
