const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, maxlength: 50, unique: true },
  password: { type: String, required: true, minlength: 6 },
  profilePicture: { type: String, default: "" },
  followers: { type: Array, default: [] },
  followings: { type: Array, default: [] },
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
