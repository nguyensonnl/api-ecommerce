const Category = require("../models/Category");

const getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.find();

    if (!categories) {
      return res.status(500).json({ success: false });
    } else {
      return res.status(200).send(categories);
    }
  } catch (e) {
    console.log(e);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res
        .status(500)
        .json({ message: "The Category with the given ID was not found." });
    }
    return res.status(200).send(category);
  } catch (e) {
    console.log(e);
  }
};

const createdCatetory = async (req, res, next) => {
  try {
    let category = new Category({
      name: req.body.name,
    });
    category = await category.save();
    if (!category) {
      return res.status(404).send("the category cannot be created!");
    }
    res.send(category);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      sucess: false,
      message: "Failed",
      err: e,
    });
  }
};

const updatedCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );

    if (!category) {
      return res.status(400).send("the category cannot be created!");
    }
    return res.send(category);
  } catch (e) {
    console.log(e);
  }
};

const deletedCategory = async (req, res, next) => {
  try {
    Category.findByIdAndRemove(req.params.id).then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "the category is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "category not found" });
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      err: e,
    });
  }
};
module.exports = {
  getAllCategory,
  getCategoryById,
  createdCatetory,
  updatedCategory,
  deletedCategory,
};
