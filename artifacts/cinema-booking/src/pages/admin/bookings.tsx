import { AdminLayout } from "@/components/layout/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { fetchAllBookings } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function AdminBookings() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchAllBookings,
  });

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
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Movie & Details</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
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
            {!isLoading && bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No bookings yet
                </TableCell>
              </TableRow>
            )}
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                  {booking.bookingReference}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{booking.customerName}</div>
                  <div className="text-xs text-muted-foreground">{booking.customerEmail}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-primary">{booking.movie.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {booking.cinema.name} • {booking.showtime.date} {booking.showtime.time}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[120px]">
                    {booking.selectedSeats.map((seat) => (
                      <span
                        key={seat}
                        className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-bold">{formatNaira(booking.totalAmount)}</TableCell>
                <TableCell>
                  <Badge
                    variant={booking.status === "confirmed" ? "default" : "destructive"}
                    className="capitalize"
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
