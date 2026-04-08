import { Router, type IRouter } from "express";
import healthRouter from "./health";
import moviesRouter from "./movies";
import showtimesRouter from "./showtimes";
import bookingsRouter from "./bookings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(moviesRouter);
router.use(showtimesRouter);
router.use(bookingsRouter);

export default router;
