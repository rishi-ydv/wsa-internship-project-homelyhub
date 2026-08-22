import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;


//Health checkup-route
app.get("/",(req, res)=>{
  res.send("HomelyHub Server is running");
})

app.listen(PORT, ()=> {
  console.log(`Server is running on port no: ${PORT}`);
});