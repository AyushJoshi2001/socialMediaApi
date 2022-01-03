const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required },
  email: { type: String, required },
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
