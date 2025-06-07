import express from "express";
import Comment from "../models/Comment.js";
import protectRoute from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/user/all", protectRoute, async (req, res) => {
  try {
    const userComments = await Comment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
    res.status(200).json(userComments);
  } catch (error) {
    console.error("Error fetching user's comments:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/:postId", protectRoute, async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const newComment = new Comment({
      user: req.user._id,
      content,
      post: postId,
    });

    await newComment.save();

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 📦 Get all comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("user", "username profileImage");

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ❌ Delete a comment
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unuserized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
