import mongoose from 'mongoose';

const ColorSchema = new mongoose.Schema({
    productid :{
        type:String,
        require:true,
    },
    color:{
        type:String,
        require:true,
    },
});

const Color = mongoose.models.Color || mongoose.model('Color' , ColorSchema);
export default Color;