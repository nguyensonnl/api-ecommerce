const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

const getAllOrder = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("customer_id", "name")
      .sort({ dateOrdered: -1 });

    if (!orders) {
      return res.status(500).json({ success: false });
    }
    return res.status(200).send(orders);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: "Failed",
      err: e,
    });
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer_id", "name")
      .populate({
        path: "orderItem_id",
        populate: { path: "product", populate: "category" },
      });
    if (!order) {
      res
        .status(500)
        .json({ message: "The Order with the given ID was not found." });
    }
    res.status(200).send(order);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: "Failed",
      err: e,
    });
  }
};

const createdOrder = async (req, res, next) => {
  try {
    let orderItemsIds = req.body.orderItem_id.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.cartQuantity,
        product_id: orderItem._id,
      });

      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    });

    orderItemsIds = await Promise.all(orderItemsIds);

    //const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(
      orderItemsIds.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product_id",
          "price"
        );

        const totalPrice = orderItem.product_id.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new Order({
      orderItem_id: orderItemsIds,
      customer_id: req.body.customer_id,
      phone: req.body.phone,
      address: req.body.address,
      note: req.body.note,
      status: req.body.status,
      totalPrice: totalPrice,
      methodPayment: req.body.methodPayment,
    });

    order = await order.save();

    if (!order) {
      return res.status(404).send("The order cannot be created!");
    }
    res.send(order);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: "Failed",
      err: e,
    });
  }
};

const updatedOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    if (!order) {
      return res.status(400).send("the category cannot be created!");
    }

    return res.send(order);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: "Failed",
      err: e,
    });
  }
};

const deletedOrder = async (req, res, next) => {
  try {
    Order.findByIdAndRemove(req.params.id).then(async (order) => {
      if (order) {
        await order.orderItem_id.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found" });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: "Failed",
      err: e,
    });
  }
};

const totalPriceOrders = async (req, res, next) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);

    if (!totalSales) {
      return res.status(400).send("The order sales cannot be generated");
    }
    return res.send({ totalSales: totalSales.pop().totalSales });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: "Failed",
      err: e,
    });
  }
};

const getCountOrders = async (req, res, next) => {
  try {
    const orderCount = await Order.countDocuments((count) => count);

    if (!orderCount) {
      res.status(500).json({ success: false });
    }
    res.send({
      count: orderCount,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: "Failed",
      err: e,
    });
  }
};

const getAllCutomerOfOrder = async (req, res, next) => {
  try {
    const listCustomerOrder = await Order.find({
      customer_id: req.params.customerid,
    })
      .populate({
        path: "orderItem_id",
        populate: { path: "product", populate: "category" },
      })
      .sort({ " dateOrdered": -1 });

    if (!listCustomerOrder) {
      res.status(500).json({ success: false });
    }
    return json.send(listCustomerOrder);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: "Failed",
      err: e,
    });
  }
};

module.exports = {
  getAllOrder,
  getOrderById,
  createdOrder,
  updatedOrder,
  deletedOrder,
  totalPriceOrders,
  getCountOrders,
  getAllCutomerOfOrder,
};
