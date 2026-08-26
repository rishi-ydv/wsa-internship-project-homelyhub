import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import userRoutes from "./routes/user.routes.js";
const app = express();
const PORT = process.env.PORT || 8000;


//middlewares
//express.json convert json into jsObj
app.use(express.json({limit:"100mb"}));

//urlencoded convert form data into jsObj
//extended true help to resolve any nested form data 
app.use(express.urlencoded({limit:"100mb", extended: true }));

//cookieParser Read the cookies sent by the browser and make them easily accessible through req.cookies.
app.use(cookieParser());


//Health checkup-route
app.get("/",(req, res)=>{
  res.send("HomelyHub Server is running");
})


app.use("/api/v1/rent/user", userRoutes);

await connectDB();
app.listen(PORT, ()=> {
  console.log(`Server is running on port no: ${PORT}`);
});