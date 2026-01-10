const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String }, // Icon name or emoji
  description: { type: String },
  color: { type: String }, // For UI styling
  createdAt: { type: Date, default: Date.now },
});

// Seed default categories
const defaultCategories = [
  {
    name: "Electronics",
    icon: "📱",
    description: "Phones, laptops, tablets, chargers",
    color: "blue",
  },
  {
    name: "Documents",
    icon: "📄",
    description: "ID cards, certificates, books",
    color: "yellow",
  },
  {
    name: "Accessories",
    icon: "👜",
    description: "Bags, wallets, jewelry, watches",
    color: "purple",
  },
  {
    name: "Clothing",
    icon: "👕",
    description: "Clothes, shoes, jackets",
    color: "pink",
  },
  {
    name: "Keys",
    icon: "🔑",
    description: "House keys, car keys, bike keys",
    color: "gray",
  },
  {
    name: "Cards",
    icon: "💳",
    description: "Credit cards, debit cards, ID cards",
    color: "green",
  },
  {
    name: "Stationery",
    icon: "✏️",
    description: "Pens, notebooks, calculators",
    color: "orange",
  },
  {
    name: "Sports",
    icon: "⚽",
    description: "Sports equipment, water bottles",
    color: "red",
  },
  {
    name: "Other",
    icon: "📦",
    description: "Miscellaneous items",
    color: "slate",
  },
];

module.exports = {
  Category: mongoose.model("category", categorySchema),
  defaultCategories,
};
