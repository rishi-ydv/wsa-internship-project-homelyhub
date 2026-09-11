import express from "express";
import { createTripPlan } from "../controllers/trip.controller.js";

const tripRouter = express.Router();

tripRouter.route("/").post(createTripPlan);

export { tripRouter };
