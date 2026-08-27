import express from "express";
import { getProperties, getPropertyById } from "../controllers/property.controller.js";


const propertyRouter = express.Router();

propertyRouter.route("/").get(getProperties);
propertyRouter.route("/:id").get(getPropertyById);

export {propertyRouter};