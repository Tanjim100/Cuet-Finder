const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  address: { type: String },
  profilePicture: { type: String, default: "" },
  reportLostPosts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "reportlost" },
  ],
  postFoundPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "postfound" }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "bookmark" }],
  thanksReceived: { type: Number, default: 0 },
  itemsReturned: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  preferredLanguage: { type: String, enum: ["en", "bn"], default: "en" },
  theme: { type: String, enum: ["dark", "light"], default: "dark" },
  pushNotifications: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("userlist", userSchema);
