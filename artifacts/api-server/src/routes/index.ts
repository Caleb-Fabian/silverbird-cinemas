import { Router, type IRouter } from "express";
import healthRouter from "./health";
import moviesRouter from "./movies";
import showtimesRouter from "./showtimes";
import bookingsRouter from "./bookings";
import cinemasRouter from "./cinemas";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(moviesRouter);
router.use(showtimesRouter);
router.use(bookingsRouter);
router.use(cinemasRouter);
router.use(dashboardRouter);

export default router;
