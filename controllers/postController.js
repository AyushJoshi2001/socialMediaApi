const postModel = require("../models/post");

const getAllPosts = async (req, res) => {
  try {
    const allposts = await postModel.find();
    res.status(200).json(allposts);
  } catch (err) {
    console.log(err);
    res.send(400).json(err);
  }
};

const getSinglePost = async (req, res) => {
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
};

const createPost = async (req, res) => {
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
};

const deletePost = async (req, res) => {
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
};

const likeDislikePost = async (req, res) => {
  const pid = req.params.pid;
  const uid = req.headers.id;
  if (pid.length < 24 || uid.length < 24) {
    return res.status(403).json("invalid post id");
  }

  try {
    const post = await postModel.findById(pid);
    if (post) {
      if (!post.likes.includes(uid)) {
        await postModel.findByIdAndUpdate(pid, { $push: { likes: uid } });
        res.status(200).json("The post has been liked");
      } else {
        await postModel.findByIdAndUpdate(pid, { $pull: { likes: uid } });
        res.status(200).json("The post has been disliked");
      }
    } else {
      res.status(403).json("post not exist");
    }
  } catch (err) {
    res.status(403).json(err);
  }
};

const createComment = async (req, res) => {
  const pid = req.params.pid;
  const uid = req.headers.id;
  const msg = req.body.msg;
  if (pid.length < 24) {
    return res.status(403).json("invalid post id");
  }

  try {
    const post = await postModel.findById(pid);
    if (post) {
      await postModel.findByIdAndUpdate(pid, {
        $push: { comments: { uid: uid, msg: msg } },
      });
      res.status(200).json("comment success");
    } else {
      res.status(403).json("post not exist");
    }
  } catch (err) {
    res.status(403).json(err);
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getSinglePost,
  deletePost,
  likeDislikePost,
  createComment,
};
