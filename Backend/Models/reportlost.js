const mongoose = require("mongoose");

const reportLostSchema = new mongoose.Schema({
  name: String,
  item: String,
  location: String,
  date: String,
  description: String,
  photo: String,
  contact: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "userlist" },
});

module.exports = mongoose.model("reportlost", reportLostSchema);