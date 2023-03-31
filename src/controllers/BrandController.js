const Brand = require("../models/Brand");

const getAllBrand = async (req, res, next) => {
  try {
    const brands = await Brand.find();

    if (!brands) {
      return res.status(500).json({ success: false });
    } else {
      return res.status(200).json(brands);
    }
  } catch (e) {
    console.log(e);
  }
};

const getBrandById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      res
        .status(500)
        .json({ message: "The Category with the given ID was not found." });
    }
    res.status(200).send(brand);
  } catch (e) {
    console.log(e);
  }
};

const createdBrand = async (req, res, next) => {
  try {
    let brand = new Brand({
      name: req.body.name,
    });
    brand = await brand.save();

    if (!brand) {
      return res.status(404).send("the category cannot be created!");
    }
    res.send(brand);
  } catch (e) {
    console.log(e);
  }
};

const updatedBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );

    if (!brand) {
      return res.status(400).send("the category cannot be created!");
    }
    return res.send(brand);
  } catch (e) {
    console.log(e);
  }
};

const deletedBrand = async (req, res, next) => {
  try {
    Brand.findByIdAndRemove(req.params.id).then((brand) => {
      if (brand) {
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
  getAllBrand,
  getBrandById,
  createdBrand,
  updatedBrand,
  deletedBrand,
};
