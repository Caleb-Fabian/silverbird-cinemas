import { useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { useBooking } from "@/hooks/use-booking";
import { mockMovies, mockShowtimes, mockCinemas } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, CreditCard, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export default function BookingSummary() {
  const [, setLocation] = useLocation();
  const { booking, clearBooking } = useBooking();
  const { toast } = useToast();

  useEffect(() => {
    if (booking.selectedSeats.length === 0) {
      setLocation("/");
    }
  }, [booking, setLocation]);

  if (booking.selectedSeats.length === 0) return null;

  const movie = mockMovies.find(m => m.id === booking.movieId) || mockMovies[0];
  const showtime = mockShowtimes.find(s => s.id === booking.showtimeId) || mockShowtimes[0];
  const cinema = mockCinemas.find(c => c.id === showtime?.cinemaId) || mockCinemas[0];

  const subtotal = booking.totalPrice;
  const fees = booking.selectedSeats.length * 500; // ₦500 convenience fee per ticket
  const total = subtotal + fees;
  const pricePerTicket = booking.selectedSeats.length > 0 ? subtotal / booking.selectedSeats.length : 3500;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Booking Confirmed!",
      description: "Your tickets have been sent to your email.",
      duration: 5000,
    });
    
    clearBooking();
    setTimeout(() => setLocation("/"), 2000);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => setLocation(`/booking/seats/${movie.id}/${showtime.id}`)}
          className="mb-6 -ml-4 text-muted-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Seats
        </Button>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Order Details */}
          <div className="flex-1 order-2 md:order-1">
            <div className="bg-card border rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Ticket className="h-6 w-6 text-primary" /> 
                Order Details
              </h2>
              
              <div className="flex gap-6 mb-6 pb-6 border-b">
                <img src={movie.poster} alt={movie.title} className="w-24 h-36 object-cover rounded shadow-md" />
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-bold">{movie.title}</h3>
                  <div className="text-muted-foreground mt-2 space-y-1">
                    <p>{cinema.name}</p>
                    <p>{new Date(showtime.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <p className="font-medium text-foreground">{showtime.time}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tickets ({booking.selectedSeats.length} × {formatNaira(pricePerTicket)})</span>
                  <span className="font-medium">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="font-medium">{booking.selectedSeats.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Convenience Fee</span>
                  <span className="font-medium">{formatNaira(fees)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center text-lg">
                  <span className="font-bold">Total Amount</span>
                  <span className="font-bold text-2xl text-primary">{formatNaira(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-[400px] order-1 md:order-2 shrink-0"
          >
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> 
                Payment
              </h2>
              
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input id="name" type="text" placeholder="John Doe" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="card">Card Number</Label>
                  <Input id="card" type="text" placeholder="0000 0000 0000 0000" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exp">Expiry (MM/YY)</Label>
                    <Input id="exp" type="text" placeholder="12/25" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" type="text" placeholder="123" required />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full h-12 text-lg" data-testid="btn-confirm-pay">
                    Pay {formatNaira(total)}
                  </Button>
                  <p className="text-center flex justify-center items-center gap-1 text-xs text-muted-foreground mt-4">
                    <CheckCircle2 className="h-3 w-3" /> Secure encrypted payment
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
