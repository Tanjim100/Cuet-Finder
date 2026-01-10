const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  claimant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userlist",
    required: true,
  },
  post: { type: mongoose.Schema.Types.ObjectId, required: true },
  postType: { type: String, enum: ["lost", "found"], required: true },
  proofDescription: { type: String, required: true },
  proofImages: [{ type: String }],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "userlist" },
  reviewNote: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("claim", claimSchema);
