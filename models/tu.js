import mongoose from 'mongoose';

const { Schema } = mongoose;

const tempUserSchema = new Schema({
  userid: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pwdhash: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "",
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 15,
  },
});

const TempUser = mongoose.models.TempUser || mongoose.model('TempUser', tempUserSchema);

export default TempUser;
