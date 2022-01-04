const express = require("express");
const { ObjectId } = require("mongodb");
const postModel = require("../models/post");
const router = express.Router();

// return all posts
router.get("/", async (req, res) => {
  try {
    const allposts = await postModel.find();
    res.status(200).json(allposts);
  } catch (err) {
    console.log(err);
    res.send(400).json(err);
  }
});

// return success or failed status
// after authorization id(which comes inside header for authorization)==uid(which comes inside req.body)
router.post("/", async (req, res) => {
  const id = String(req.headers.id);
  if (id === req.body.uid) {
    const createPost = new postModel({
      uid: req.body.uid,
      title: req.body.title,
      message: req.body.message,
      author: req.body.author,
    });

    try {
      await createPost.save();
      res.status(200).json("success");
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  } else {
    res.status(403).json("user id mismatched");
  }
});

// return single post
// post will be fetch after authorization
router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const singlePost = await postModel.findById(pid);
    if (!singlePost) {
      res.status(400).json("Post Not Found");
    }
    res.status(200).json(singlePost);
  } catch (err) {
    console.log(err);
    res.send(400).json(err);
  }
});

// update post
// after authorization if id(which comes inside header for authorization)==uid(which comes inside post.uid and pid for fetching the post)
router.put("/:pid", (req, res) => {
  res.status(200).send("success");
});

// return success or failed status
// after authorization id(which comes inside header for authorization)==uid(which comes inside post.uid and pid for fetching the post)
router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    if (pid.length < 24) {
      return res.status(403).json("invalid post id");
    }
    const fetchPost = await postModel.findById(pid);
    if (fetchPost) {
      const id = String(req.headers.id);
      if (fetchPost.uid === id) {
        const deletedPost = await postModel.findByIdAndDelete(req.params.pid);
        res.status(200).send("success");
      } else {
        res.status(403).json("You have no access to delete this post");
      }
    } else {
      res.status(403).json("post not exist");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
