const express = require("express");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware"); 
const upload = require('../middleware/upload');
const router = express.Router();

router.post("/", authenticate, authorize(["User", "Admin", "SuperAdmin"]), upload.fields([
    { name: 'singleImage', maxCount: 1 },
  ]),  createPost);
router.get("/", authenticate, authorize(["User", "Admin", "SuperAdmin"]), getPosts);
router.get("/:id", authenticate, authorize(["User","Admin","SuperAdmin"]), getPostById);
router.put("/:id", authenticate, authorize(["User", "Admin", "SuperAdmin"]), upload.fields([
  { name: 'singleImage', maxCount: 1 },
]), updatePost);
router.delete("/:id", authenticate, authorize(["User", "Admin", "SuperAdmin"]), deletePost);

module.exports = router;
