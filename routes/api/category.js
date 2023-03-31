const express = require("express");
const router = express.Router();
const CategoryController = require("../../controllers/CategoryController");

router.route("/").get(CategoryController.getAllCategory);
router.route("/:id").get(CategoryController.getCategoryById);
router.route("/").post(CategoryController.createdCatetory);
router.route("/:id").put(CategoryController.updatedCategory);
router.route("/:id").delete(CategoryController.deletedCategory);

module.exports = router;
