const express = require("express");
const userRoute = require("./user");
const customerRoute = require("./customer");
const brandRoute = require("./brand");
const categoryRoute = require("./category");
const produdctRoute = require("./product");
const orderRoute = require("./order");
const uploadRoute = require("./upload");

const router = express.Router();

router.use("/users", userRoute);
router.use("/customers", customerRoute);
router.use("/products", produdctRoute);
router.use("/brands", brandRoute);
router.use("/categories", categoryRoute);
router.use("/orders", orderRoute);

router.use("/upload", uploadRoute);

module.exports = router;
