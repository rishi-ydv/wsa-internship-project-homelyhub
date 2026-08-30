import express from "express";
import {
  getBookingDetails,
  getUserBookings,
  createOrder,
  verifyPayment,
} from "../controllers/booking.controller.js";
import { protect } from "../controllers/auth.controller.js";

const bookingRouter = express.Router();

bookingRouter.get("/", protect, getUserBookings);
bookingRouter.get("/:bookingId", protect, getBookingDetails);
bookingRouter.post("/create-order", protect, createOrder);
bookingRouter.post("/verify-payment", protect, verifyPayment);

export {bookingRouter};
