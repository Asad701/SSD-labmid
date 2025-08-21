import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true, 
  },
  productid: {
    type: String,
    required: true,
  },
  productcount: {
    type: Number,
    default: 1,
    required: true,
  },
}, {
  timestamps: true,
});


CartSchema.index({ userid: 1, productid: 1 }, { unique: true });

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
export default Cart;
