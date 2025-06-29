import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    user:{
        type: String,
        ref:"User",
        required: true
    },
    content:{
        type: String,
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    }
}, {timestamps:true})
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;