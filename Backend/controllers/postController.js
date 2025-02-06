const Post = require("../models/Post");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const singleImage = req.files['singleImage'][0].path;

    const newPost = await Post.create({
      title,
      content,
      singleImage,
      createdBy: req.user.id, 
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Get all posts (Admin, SuperAdmin) or user's posts (User role)
const getPosts = async (req, res) => {
  try {
    let posts;
    if (req.user.role === "User") {
      posts = await Post.find({ createdBy: req.user.id });
    } else {
      posts = await Post.find().populate("createdBy", "name email"); 
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};


// Fetch Single Post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a post (Users can only update their own posts)
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const singleImage = req.files.singleImage ? req.files.singleImage[0].path : null;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.user.role !== "SuperAdmin" && req.user.role !== "Admin" && post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.singleImage = singleImage || post.singleImage;
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Delete a post (Users can only delete their own posts)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const post = await Post.findByIdAndDelete(id);
    // findByIdAndDelete
    // console.log(post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.user.role !== "SuperAdmin" && req.user.role !== "Admin" && post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    // await post.remove();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
