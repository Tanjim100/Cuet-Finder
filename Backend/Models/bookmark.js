const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userlist",
    required: true,
  },
  post: { type: mongoose.Schema.Types.ObjectId, required: true },
  postType: { type: String, enum: ["lost", "found"], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Compound index to ensure user can't bookmark same post twice
bookmarkSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model("bookmark", bookmarkSchema);
