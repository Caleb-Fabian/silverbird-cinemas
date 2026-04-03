import { AdminLayout } from "@/components/layout/AdminLayout";
import { mockBookings, mockMovies, mockCinemas, mockShowtimes } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminBookings() {
  // Sort bookings newest first
  const sortedBookings = [...mockBookings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <p className="text-muted-foreground mt-1">View and manage customer ticket purchases</p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Movie & Details</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBookings.map((booking) => {
              const movie = mockMovies.find(m => m.id === booking.movieId);
              const cinema = mockCinemas.find(c => c.id === booking.cinemaId);
              const showtime = mockShowtimes.find(s => s.id === booking.showtimeId);
              
              return (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                    #{booking.id.toUpperCase()}
                  </TableCell>
                  <TableCell className="font-medium">{booking.customerName}</TableCell>
                  <TableCell>
                    <div className="font-medium text-primary">{movie?.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {cinema?.name} • {showtime?.date} {showtime?.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                      {booking.seats.map(seat => (
                        <span key={seat} className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">${booking.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={booking.status === 'confirmed' ? 'default' : 'destructive'} 
                      className="capitalize"
                    >
                      {booking.status}
                    </Badge>
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