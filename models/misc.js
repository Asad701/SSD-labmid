import mongoose from "mongoose";

const miscSchema = new mongoose.Schema({
  miscid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  videos: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  comments: {
    type: [
      {
        comment: { type: String, required: true },
        userName: { type: String, required: true },
      },
    ],
    default: [],
  },
  promo: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
  },
}, { timestamps: true });

const Misc = mongoose.models.Misc || mongoose.model("Misc", miscSchema);
export default Misc;
