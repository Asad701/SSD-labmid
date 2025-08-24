import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    orderid: { type: String, required: true, unique: true },
    name: {
        type: String,
        required: true,
    },
    userid: {
        type: String,
        required: true,  
    },
    email: {
        type: String,
        required: true,  
    },
    shipped: {
        type: Boolean,
        default: false,
    },
    dhltracking: {
        type: String,
        default: "",
    },
    orderprice: {
        type: Number,
    },
    shippingaddress: {
        type: String,
        required: true,
    },
    contactno: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    status: { 
        type: String,
        default: "PENDING" 
    }

}, { timestamps: true });


const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
