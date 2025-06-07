import mongoose from "mongoose";

const replySchema = mongoose.Schema({
    user:{
        type: String,
        ref:"User",
        required: true
    },
    content:{
        type: String,
        required: true
    },
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
        required: true,
    }
}, {timestamps:true})
const Reply = mongoose.model("Replies", replySchema);
export default Reply;