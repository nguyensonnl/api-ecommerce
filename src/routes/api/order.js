const express = require("express");
const router = express.Router();
const OrderControler = require("../../controllers/OrderController");

router.route("/").get(OrderControler.getAllOrder);
router.route("/:id").get(OrderControler.getOrderById);
router.route("/").post(OrderControler.createdOrder);
router.route("/:id").put(OrderControler.updatedOrder);
router.route("/:id").delete(OrderControler.deletedOrder);
router.route("/get/totalsales").get(OrderControler.totalPriceOrders);
router.route("/get/count").get(OrderControler.getCountOrders);
router
  .route("/get/customerorder/:customerid")
  .get(OrderControler.getAllCutomerOfOrder);

module.exports = router;
