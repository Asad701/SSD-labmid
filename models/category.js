import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    categoryid :{
        type:String,
        unique:true,
        required:true,
    },
    title :{
        type:String,
        required:true,
    },
    image :{
        type:String,
        required:true,
    },
});

const Category = mongoose.models.Category || mongoose.model('Category' , CategorySchema);
export default Category;