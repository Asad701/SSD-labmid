import mongoose from 'mongoose';

const FavouriteSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  productid: {
    type: String,
    required: true,
  },
}, { timestamps: true });

FavouriteSchema.index({ userid: 1, productid: 1 }, { unique: true });
const Favourite = mongoose.models.Favourite || mongoose.model('Favourite', FavouriteSchema);

export default Favourite;
