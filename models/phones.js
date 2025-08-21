import mongoose from "mongoose";

const PhonesSchema = new mongoose.Schema({
    userid :{
        type:String,
        required:true,
    },
    phone :{
        type:String,
        reuired:true,
    },
});

const Phone = mongoose.models.Phone || mongoose.model('Phone',PhonesSchema);
export default Phone;