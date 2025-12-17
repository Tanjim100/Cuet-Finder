const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  address: { type: String },
  profilePicture: { type: String, default: "" },
  reportLostPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "reportlost" }],
  postFoundPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "postfound" }],
});

module.exports = mongoose.model("userlist", userSchema);