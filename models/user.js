import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
      unique: true,
    },
    avatar:{
      type:String,
      default:'logo.png',
    },
    fname: {
      type: String,
      required:true,
      trim: true,
    },
    lname: {
      type: String,
      required:true,
      trim: true,
    },
    email: {
      type: String,
      required:true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    pwdhash: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);


const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
