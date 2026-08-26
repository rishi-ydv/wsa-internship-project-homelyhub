import {User} from "../models/user.model.js";
import jwt from  "jsonwebtoken";
import crypto from "node:crypto";
import imagekit from "../utils/ImagekitIO.js";
import {sendMail, forgotPasswordMailGenContent } from "../utils/mail.js";
import {signinToken, createSendToken, defaultAvatarUrl, filterObj} from "../utils/token.js";

//signup : create the new account
const signup = async(req, res) =>{
  try{
    //get the data from req.body
    const { name, email, phoneNumber, password, passwordConfirm, avatar} = req.body;

    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password,
      passwordConfirm,
      avatar:{url:avatar || defaultAvatarUrl(name)}
    })

    createSendToken(newUser,201,res);

  }catch(error){
     const duplicateField = Object.keys(error.keyPattern || {})[0];
     const message = duplicateField ? `An account with that ${duplicateField} already exists` : error.message;
     res.status(400).json({message});
  }
}

//login: check email and password then give token(jwt)
const login = async(req, res) =>{
  try{
    const {email, password} = req.body;
    if(!email || !password){
      throw new Error("Please provide email or password");
    }
    const user = await User.findOne({email}).select("+password");
    if(!user || (await user.correctPassword(password, user.password)) === false){
      throw new Error("Please provide email or password");
    }
    createSendToken(user,200,res);
  }catch(error){
    res.status(401).json({status:"fail", message:error.message});
  }
}

export {signup, login};