const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderItem_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    required: true,
    default: "Đang chờ",
  },
  totalPrice: {
    type: Number,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
  methodPayment: {
    type: String,
  },
});

//break _id
// productSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// productSchema.set("toJSON", {
//   virtuals: true,
// });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

//exports.Order = mongoose.model("Order", orderSchema);
