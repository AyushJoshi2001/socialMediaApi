const mongoose = require("mongoose");

const userPostMappingSchema = new mongoose.Schema({
  uid: { pid: String, required },
});

const userPostMappingModel = mongoose.model(
  "userPostMapping",
  userPostMappingSchema
);
module.exports = userPostMappingModel;
