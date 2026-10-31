import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/hooks/use-booking";
import { fetchShowtime } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowLeft, MonitorPlay } from "lucide-react";

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const SEATS_PER_ROW = 12;

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export default function SeatSelection() {
  const { movieId, showtimeId } = useParams<{ movieId: string, showtimeId: string }>();
  const [, setLocation] = useLocation();
  const { booking, updateSeats, setBooking } = useBooking();

  const { data: showtime, isLoading, isError } = useQuery({
    queryKey: ["showtime", showtimeId],
    queryFn: () => fetchShowtime(showtimeId!),
    enabled: !!showtimeId,
  });

  const pricePerSeat = showtime?.price ?? 3500;

  const [bookedSeats] = useState<string[]>(() => {
    const booked = [];
    const hash = showtimeId?.length || 5;
    for (let i = 0; i < 20; i++) {
      const r = ROWS[(hash * i) % ROWS.length];
      const s = ((hash * i * 3) % SEATS_PER_ROW) + 1;
      booked.push(`${r}${s}`);
    }
    return booked;
  });

  const [selectedSeats, setSelectedSeats] = useState<string[]>(booking.selectedSeats);

  // Store movieId and showtimeId in booking context
  useEffect(() => {
    if (movieId && showtimeId) {
      setBooking({ ...booking, movieId, showtimeId });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId, showtimeId]);

  useEffect(() => {
    if (isError) setLocation("/movies");
  }, [isError, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-dvh flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading seats...</p>
        </div>
      </div>
    );
  }

  if (!showtime) return null;

  const cinema = showtime.cinema;
  const movieTitle = showtime.movie?.title ?? "";
  const moviePoster = showtime.movie?.poster ?? "";

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats(prev => {
      const newSeats = prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId];
      updateSeats(newSeats, newSeats.length * pricePerSeat);
      return newSeats;
    });
  };

  const handleContinue = () => {
    updateSeats(selectedSeats, selectedSeats.length * pricePerSeat);
    setLocation("/booking/summary");
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation(`/movies/${movieId}`)}
          className="mb-6 -ml-4 text-muted-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Movie
        </Button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Seat Map Area */}
          <div className="flex-1 overflow-x-auto pb-8">
            <div className="min-w-150 flex flex-col items-center">

              {/* Screen */}
              <div className="w-4/5 mb-16 relative">
                <div className="h-2 w-full bg-primary/20 rounded-full shadow-[0_10px_30px_-5px_rgba(14,165,233,0.3)] dark:shadow-[0_10px_30px_-5px_rgba(14,165,233,0.5)]"></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-muted-foreground flex items-center gap-2 text-sm uppercase tracking-widest font-semibold">
                  <MonitorPlay className="h-4 w-4" /> Screen
                </div>
              </div>

              {/* Seat Grid */}
              <div className="flex flex-col gap-3">
                {ROWS.map((row) => (
                  <div key={row} className="flex items-center gap-2 justify-center">
                    <span className="w-6 text-center font-semibold text-muted-foreground text-sm">{row}</span>
                    <div className="flex gap-2">
                      {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                        const seatNum = i + 1;
                        const seatId = `${row}${seatNum}`;
                        const isBooked = bookedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        const addAisle = seatNum === 6;

                        return (
                          <div key={seatId} className={`flex ${addAisle ? 'mr-6' : ''}`}>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              disabled={isBooked}
                              onClick={() => toggleSeat(seatId)}
                              className={`
                                h-8 w-8 rounded-t-lg rounded-b-sm border-2 transition-all duration-200
                                ${isBooked ? 'bg-muted border-muted text-muted-foreground/30 cursor-not-allowed' :
                                  isSelected ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30' :
                                  'bg-background border-primary/30 hover:border-primary text-transparent hover:text-primary'}
                                flex items-center justify-center text-[10px] font-medium
                              `}
                              data-testid={`seat-${seatId}`}
                            >
                              {seatNum}
                            </motion.button>
                          </div>
                        );
                      })}
                    </div>
                    <span className="w-6 text-center font-semibold text-muted-foreground text-sm">{row}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-12 flex gap-6 px-6 py-3 bg-muted rounded-full text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-t border-2 border-primary/30 bg-background"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-t border-2 border-primary bg-primary"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-t border-2 border-muted bg-muted"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-card border rounded-xl p-6 sticky top-24 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

              <div className="flex gap-4 mb-6 pb-6 border-b">
                {moviePoster && (
                  <img src={moviePoster} alt={movieTitle} className="w-16 h-24 object-cover rounded shadow-sm" />
                )}
                <div>
                  <h3 className="font-bold line-clamp-2">{movieTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{cinema.name}</p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {new Date(showtime.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {showtime.time}
                  </p>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-muted-foreground">Selected Seats</span>
                  <span className="font-semibold text-right">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Price per seat</span>
                  <span>{formatNaira(pricePerSeat)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">{formatNaira(selectedSeats.length * pricePerSeat)}</span>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={selectedSeats.length === 0}
                onClick={handleContinue}
                data-testid="btn-continue-payment"
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
