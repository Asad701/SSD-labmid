import mongoose from 'mongoose';

const OrderProductSchema = new mongoose.Schema({
    productid :{
        type: String,
        require:true,
    },
    orderid :{
        type: String,
        require:true,
    },    
},
{ timestamps: true },);


const OrderProduct = mongoose.models.Orderproduct || mongoose.model('Orderproduct',OrderProductSchema);
export default OrderProduct;