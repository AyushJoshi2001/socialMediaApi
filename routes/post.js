const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // return all posts
  res.status(200).send("success");
});

router.get("/:pid", (req, res) => {
  // return single post
  res.status(200).send("success");
});

router.put("/:pid", (req, res) => {
  // update post
  res.status(200).send("success");
});

router.delete("/:pid", (req, res) => {
  // delete post
  res.status(200).send("success");
});

module.exports = router;
