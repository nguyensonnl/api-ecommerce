const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: { type: String, slug: "name" },
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
