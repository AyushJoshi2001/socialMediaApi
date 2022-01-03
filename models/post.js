const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  uid: { type: String, required },
  title: { type: String, required },
  message: { type: String, required },
  author: { type: String, required },
});

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
