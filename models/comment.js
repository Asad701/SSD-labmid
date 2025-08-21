import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  productid: {
    type: String,
  },
  comment: {
    type: String,
    required:true,
    required: true,
  },
  userEmail: {
    type: String,
    required:true,
    default: '',
  },
  userName: {
    type: String,
    required:true,
    default: '', 
  },
},
{ timestamps: true },);

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
export default Comment;
