import mongoose from "mongoose";

//Connect my application to MongoDB.
const connectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully...");
  } catch(err){
    console.log(`Error: ${err.message}`);
    //error/failure: means the application is stopping because of an error.
    process.exit(1);
  }
}

export default connectDB;