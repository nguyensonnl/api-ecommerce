const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: { type: String, slug: "name" },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
