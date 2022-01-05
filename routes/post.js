const express = require("express");
const {
  getAllPosts,
  createPost,
  getSinglePost,
  deletePost,
  likeDislikePost,
} = require("../controllers/postController");
const router = express.Router();

// return all posts
router.get("/", getAllPosts);

// return success or failed status
// after authorization id(which comes inside header for authorization)==uid(which comes inside req.body)
router.post("/", createPost);

// return single post
// post will be fetch after authorization
router.get("/:pid", getSinglePost);

// update post
// after authorization if id(which comes inside header for authorization)==uid(which comes inside post.uid and pid for fetching the post)
router.put("/:pid", (req, res) => {
  res.status(200).send("Post update feature is not available yet!");
});

// return success or failed status
// after authorization id(which comes inside header for authorization)==uid(which comes inside post.uid and pid for fetching the post)
router.delete("/:pid", deletePost);

router.put("/:pid/like", likeDislikePost);

module.exports = router;
