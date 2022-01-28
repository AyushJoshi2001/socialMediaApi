const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  title: { type: String, required: true, minlength: 3, maxlength: 50 },
  image: { type: String, default: "" },
  message: { type: String, required: true, minlength: 3, maxlength: 50 },
  author: { type: String, required: true, minlength: 3, maxlength: 50 },
  likes: { type: Array, default: [] },
  date: { type: Date, default: Date.now() },
  comments: { type: Array, default: [] },
});

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
