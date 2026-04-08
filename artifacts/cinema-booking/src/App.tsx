import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { BookingProvider } from "@/hooks/use-booking";

import Home from "@/pages/home";
import Movies from "@/pages/movies";
import MovieDetails from "@/pages/movie-details";
import SeatSelection from "@/pages/seat-selection";
import BookingSummary from "@/pages/booking-summary";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminMovies from "@/pages/admin/movies";
import AdminShowtimes from "@/pages/admin/showtimes";
import AdminBookings from "@/pages/admin/bookings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/movies" component={Movies} />
      <Route path="/movies/:id" component={MovieDetails} />
      <Route
        path="/booking/seats/:movieId/:showtimeId"
        component={SeatSelection}
      />
      <Route path="/booking/summary" component={BookingSummary} />

      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/movies" component={AdminMovies} />
      <Route path="/admin/showtimes" component={AdminShowtimes} />
      <Route path="/admin/bookings" component={AdminBookings} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="cinebook-theme"
      >
        <AuthProvider>
          <BookingProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
