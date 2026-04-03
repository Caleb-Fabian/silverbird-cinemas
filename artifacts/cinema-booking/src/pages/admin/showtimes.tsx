import { AdminLayout } from "@/components/layout/AdminLayout";
import { mockShowtimes, mockMovies, mockCinemas } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminShowtimes() {
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Showtimes Management</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button data-testid="btn-add-showtime"><Plus className="mr-2 h-4 w-4" /> Add Showtime</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Showtime</DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center text-muted-foreground">
              Form implementation placeholder
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
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
              <TableHead>Seats Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockShowtimes.map((showtime) => {
              const movie = mockMovies.find(m => m.id === showtime.movieId);
              const cinema = mockCinemas.find(c => c.id === showtime.cinemaId);
              const occupancyPct = ((showtime.totalSeats - showtime.availableSeats) / showtime.totalSeats) * 100;
              
              return (
                <TableRow key={showtime.id}>
                  <TableCell className="font-medium">{movie?.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {cinema?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{showtime.date}</div>
                    <div className="text-xs text-muted-foreground">{showtime.time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{showtime.availableSeats} / {showtime.totalSeats}</span>
                      <Badge variant={occupancyPct > 90 ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0">
                        {occupancyPct > 90 ? 'Almost Full' : `${Math.round(occupancyPct)}% Booked`}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Edit</Button>
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