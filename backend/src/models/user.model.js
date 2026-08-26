//user Schema
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";


const userSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required:[true, "Please enter your name"],
        trim:true,
        maxLength:[50, "Your name cannot be longer than 50 characters"]
    },
    email:{
      type:String,
      required:[true, "Please enter your email"],
      unique:true,
      lowercase:true,
      trime:true,
      validate:[validator.isEmail, "Please enter a valid email address."]
    },
    password:{
      type:String,
      required:[true,"Please enter a password"],
      minlength:[6, "Your password must be longer than 6 charcters"],
    },
    passwordConfirm:{
      type:String,
      required:[true, "Please confirm your passowrd"],
      select:false,
      validate:{
        validator:function(el){
          return el === this.password
        },
        message:"Password are not the same !"
      }
    },
    phoneNumber:{
      type:String,
      required:true,
      unique:true,
      trim:true,
    },
    role:{
      type:String,
      enum:["user", "admin"],
      default:"user"
    },
    avatar:{
      url:{type:String},
      public_id:{type:String}
    },
    passwordChangedAt:{
      type:Date
    },
    passwordResetToken:{
      type:String,
      select:false,
      index:true
    },
    passwordResetExpires:{
      type:Date,
      select:false,
    }
  },
  {timestamps:true}
)
//setting to not pass in response from server
userSchema.set("toJSON", {
  transform:function(doc,ret){
    delete ret.password;
    delete ret.passwordConfirm;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.__v;
    return ret;
  }
})

//password logic
userSchema.pre("save",async function(){
  if(!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password,12);
  this.passwordConfirm = undefined;
})

//login check
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword,userPassword);
}

//it's validate jwt token is the token is valid or not like if user update the password but token issued remain older then it compare with password changed time and jwt issue time if it less than passwordchanged then return false and reject the token and tell to user login again
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime()/1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
}

//forgot password
userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.passwordResetExpires = Date.now() +10 *60 *1000;
  return resetToken;
}

const User = mongoose.model("User", userSchema);
export {User};

