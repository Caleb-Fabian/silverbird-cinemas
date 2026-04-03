import { createContext, useContext, useState } from "react";

interface BookingState {
  movieId: string | null;
  showtimeId: string | null;
  selectedSeats: string[];
  totalPrice: number;
}

interface BookingContextType {
  booking: BookingState;
  setBooking: (booking: BookingState) => void;
  updateSeats: (seats: string[], price: number) => void;
  clearBooking: () => void;
}

const defaultState: BookingState = {
  movieId: null,
  showtimeId: null,
  selectedSeats: [],
  totalPrice: 0,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(defaultState);

  const updateSeats = (seats: string[], price: number) => {
    setBooking((prev) => ({ ...prev, selectedSeats: seats, totalPrice: price }));
  };

  const clearBooking = () => {
    setBooking(defaultState);
  };

  return (
    <BookingContext.Provider value={{ booking, setBooking, updateSeats, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
