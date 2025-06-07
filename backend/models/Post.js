import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // ✅ Use ObjectId here
    ref: "User", // ✅ Reference the User model name exactly
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  aiSuggestions: {
    songs: [String],
    movies: [String],
    books: [String],
    shows: [String],
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
}, { timestamps: true });

const Post = mongoose.model("Posts", postSchema);
export default Post;
