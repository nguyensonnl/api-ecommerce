const express = require("express");
const router = express.Router();
const BrandController = require("../../controllers/BrandController");

router.route("/").get(BrandController.getAllBrand);
router.route("/:id").get(BrandController.getBrandById);
router.route("/").post(BrandController.createdBrand);
router.route("/:id").put(BrandController.updatedBrand);
router.route("/:id").delete(BrandController.deletedBrand);

module.exports = router;
