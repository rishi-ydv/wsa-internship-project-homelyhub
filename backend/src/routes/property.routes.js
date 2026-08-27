import express from "express";
import { getProperties } from "../controllers/property.controller.js";


const propertyRouter = express.Router();

propertyRouter.route("/").get(getProperties);

export {propertyRouter};