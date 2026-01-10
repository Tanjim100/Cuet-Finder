const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userlist",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "match",
      "message",
      "claim",
      "rating",
      "bookmark_update",
      "expiry_warning",
    ],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedPost: { type: mongoose.Schema.Types.ObjectId },
  relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: "userlist" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("notification", notificationSchema);
