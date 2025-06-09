import express from "express";
import "dotenv/config";
import Post from "../models/Post.js";
import protectRoute from "../middleware/auth.middleware.js";
import { InferenceClient } from "@huggingface/inference";

const router = express.Router();
const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

// 🧠 AI Suggestion Utility
export const getAISuggestions = async (text) => {
  const prompt = `
A user just wrote a post expressing their emotions:

"${text}"

Based on this, suggest:
1. 3 songs
2. 3 movies
3. 3 books
4. 3 TV shows

Format your response in this exact JSON structure:
{
  "songs": ["..."],
  "movies": ["..."],
  "books": ["..."],
  "shows": ["..."]
}
Don't include any other characters besides the JSON structure.
`;

  try {
    const response = await client.chatCompletion({
      provider: "together",
      model: "deepseek-ai/DeepSeek-R1-0528",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let aiText = response.choices?.[0]?.message?.content?.trim() || "";
    console.log("🧠 Raw AI Response:", aiText);

    // Remove ```json or ``` if the model wrapped response in a code block
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    // Extract only the JSON object substring
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("❌ No JSON object found in AI response.");
      return null;
    }

    const jsonStr = jsonMatch[0];
    const json = JSON.parse(jsonStr);
    return json;

  } catch (err) {
    console.error("❌ Failed to parse AI suggestions:", err.message);
    return null;
  }
};


// 📬 POST /api/posts/create
router.post("/create", protectRoute, async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;
    const author = req.user._id;

    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ⏳ Get dynamic AI suggestions
    const suggestions = await getAISuggestions(content);

    const newPost = new Post({
      title,
      content,
      user: author,
      isPublic: isPublic ?? false,
      aiSuggestions: suggestions,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/", protectRoute, async(req,res)=>{
    try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = Number(page - 1)*limit;
        const totalBooks = await Post.countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");
        res.send({
            posts,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            });
    }catch(error){
        console.log("Error", error.message);
        res.status(500).json({message:"Internal server error"});
    }
})
router.get("/user", protectRoute, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Get user posts failed: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.delete("/:id", protectRoute, async(req,res)=>{
    try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "User is not authorized to delete this post" });

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error deleting book", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.patch('/:id', protectRoute, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id; // From decoded JWT
    const { isPublic } = req.body;

    // Ensure the post exists and belongs to the user
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

    // Update field(s)
    if (typeof isPublic === 'boolean') {
      post.isPublic = isPublic;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
