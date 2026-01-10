const mongoose = require("mongoose");

const reportLostSchema = new mongoose.Schema({
  name: String,
  item: String,
  location: String,
  date: String,
  description: String,
  photo: String,
  photos: [{ type: String }], // Multiple photos support
  contact: String,
  category: { type: String, default: "Other" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "userlist" },
  status: {
    type: String,
    enum: ["active", "claimed", "resolved", "expired"],
    default: "active",
  },
  matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: "postfound" },
  matchScore: { type: Number },
  views: { type: Number, default: 0 },
  bookmarkCount: { type: Number, default: 0 },
  isArchived: { type: Boolean, default: false },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-set expiry date to 30 days from creation
reportLostSchema.pre("save", function (next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model("reportlost", reportLostSchema);
