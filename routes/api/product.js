const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/ProductController");
const uploadFile = require("../../middlewares/multer");
const middlewareFile = uploadFile.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

router.route("/").get(ProductController.getAllProduct);
router.route("/:id").get(ProductController.getProductByID);
router.route("/").post(middlewareFile, ProductController.createdProduct);
router.route("/:id").put(ProductController.updatedProduct);
router.route("/:id").delete(ProductController.deletedProduct);
router.route("/get/count").get(ProductController.getCountProduct);
router.route("/get/featured/:count").get(ProductController.getProductFeatured);

module.exports = router;
