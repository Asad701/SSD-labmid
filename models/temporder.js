import mongoose from 'mongoose';
import { unique } from 'next/dist/build/utils';

const TempOrderSchema = new mongoose.Schema({
    orderid: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    userid: {
        type: String,
        required: true,  
    },
    products: {
        type: [Object],
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
    }
}, { timestamps: true });



const TempOrder = mongoose.models.TempOrder || mongoose.model('TempOrder', TempOrderSchema);

export default TempOrder;
