const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "userlist" }],
  relatedPost: {
    postId: { type: mongoose.Schema.Types.ObjectId },
    postType: { type: String, enum: ["lost", "found"] },
  },
  lastMessage: { type: String },
  lastMessageTime: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("conversation", conversationSchema);
