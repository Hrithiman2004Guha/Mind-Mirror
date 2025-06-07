import express from "express";
import Reply from "../models/Reply.js";
import Comment from "../models/Comment.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// 📨 Create a reply for a comment
router.post("/:commentId", protectRoute, async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;
    const user = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const newReply = new Reply({
      content,
      user,
      comment: commentId,
    });

    await newReply.save();

    // Optional: push reply to comment's replies array
    comment.replies = comment.replies || [];
    comment.replies.push(newReply._id);
    await comment.save();

    res.status(201).json({ message: "Reply added", reply: newReply });
  } catch (error) {
    console.error("Failed to add reply:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this reply" });
    }

    await reply.deleteOne();
    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (err) {
    console.error("Error deleting reply:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/:commentId", protectRoute, async (req, res) => {
  try {
    const replies = await Reply.find({ comment: req.params.commentId })
      .sort({ createdAt: -1 })
      .populate("user", "username profileImage");

    res.status(200).json(replies);
  } catch (err) {
    console.error("Error fetching replies:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/user/all", protectRoute, async (req, res) => {
  try {
    const replies = await Reply.find({ user: req.user._id })
      .sort({ createdAt: -1 })

    res.status(200).json(replies);
  } catch (err) {
    console.error("Error fetching user's replies:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router;
