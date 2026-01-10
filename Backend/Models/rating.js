const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userlist",
    required: true,
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userlist",
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  relatedPost: { type: mongoose.Schema.Types.ObjectId },
  postType: { type: String, enum: ["lost", "found"] },
  createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate ratings for same post
ratingSchema.index(
  { fromUser: 1, toUser: 1, relatedPost: 1 },
  { unique: true }
);

module.exports = mongoose.model("rating", ratingSchema);
