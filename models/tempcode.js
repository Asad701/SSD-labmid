import mongoose from 'mongoose';

const { Schema } = mongoose;

const tempCodeSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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

const TempCode = mongoose.models.TempCode || mongoose.model('TempCode', tempCodeSchema);

export default TempCode;
