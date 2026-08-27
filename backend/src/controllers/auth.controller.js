import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import imagekit from "../utils/ImagekitIO.js";
import { sendMail, forgotPasswordMailGenContent } from "../utils/mail.js";
import {
  signinToken,
  createSendToken,
  defaultAvatarUrl,
  filterObj,
} from "../utils/token.js";

//signup : create the new account
const signup = async (req, res) => {
  try {
    //get the data from req.body
    const { name, email, phoneNumber, password, passwordConfirm, avatar } =
      req.body;

    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password,
      passwordConfirm,
      avatar: { url: avatar || defaultAvatarUrl(name) },
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    const duplicateField = Object.keys(error.keyPattern || {})[0];
    const message = duplicateField
      ? `An account with that ${duplicateField} already exists`
      : error.message;
    res.status(400).json({ message });
  }
};

//login: check email and password then give token(jwt)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please provide email or password");
    }
    const user = await User.findOne({ email }).select("+password");
    if (
      !user ||
      (await user.correctPassword(password, user.password)) === false
    ) {
      throw new Error("Please provide email or password");
    }
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(401).json({ status: "fail", message: error.message });
  }
};

//protect guard
const protect = async (req, res, next) => {
  try {
    //Step 1: find token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt && req.cookies.jwt !== "loggedout") {
      token = req.cookies.jwt;
    }

    //Step 2: no token so stop here
    if (!token) {
      throw new Error("You are not logged in! Please login to access");
    }
    //Step 3: is token real?
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    //Step 4: token is real but user still exists?
    const currentUser = await User.findById(decode.id);
    if (!currentUser) {
      throw new Error("The user belonging to the token doesn't exists");
    }

    // Step 5: Reject the token if the user changed their password after it was issued.
    if (currentUser.changedPasswordAfter(decode.iat)) {
      throw new Error("User recently changed the password, please login again");
    }

    //Step 6: all checked passed
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};

export { signup, login, protect };
