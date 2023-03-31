const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;

//exports.OrderItem = mongoose.model("OrderItem", orderItemSchema);
