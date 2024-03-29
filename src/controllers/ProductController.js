const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");

const getAllProduct = async (req, res) => {
  try {
    //localhost:3000/api/v1/products?categories=234234,234234
    // let filter = {};
    // if (req.query.categories) {
    //   filter = { category: req.query.categories.split(",") };
    // }

    const queryObj = { ...req.query };
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "categories",
      "name",
      "price_max",
      "price_min",
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    let query = Product.find(JSON.parse(queryString))
      .populate("category")
      .populate("brand");

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    if (req.query.price_min && req.query.price_max) {
      const minPrice = parseFloat(req.query.price_min);
      const maxPrice = parseFloat(req.query.price_max);

      query = query.where("price").gte(minPrice).lte(maxPrice);
    }

    // Count total number of items in the database
    const totalCount = await Product.countDocuments();

    const page = parseInt(req.query.page * 1) || 1;
    const limit = parseInt(req.query.limit) * 1 || totalCount;

    // Calculate the total number of pages
    const page_size = Math.ceil(totalCount / limit);

    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.categories) {
      const cateId = req.query.categories.split(",");
      query = query.where("category").in(cateId);
    }

    if (req.query.name) {
      const searchQuery = { name: { $regex: req.query.name, $options: "i" } };
      query = query.where(searchQuery);
    }

    const productList = await query;

    //const productList = await Product.find(filter)
    //.populate("category")
    //.populate("brand");
    //get category in product
    //.populate('category');//Lấy hết trường của field category
    //.select("name image -_id");// Chỉ lấy ra name image bỏ id

    if (!productList) {
      res.status(500).json({ success: false });
    }
    // res.send(productList);
    res.status(200).json({
      message: "success",
      data: {
        productList,
        pagination: {
          limit: productList.length,
          page_size: page_size,
          page: page,
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getProductBySlug = async (req, res) => {
  try {
    let product = await Product.findOne({ slug: req.params.slug }).populate(
      "brand",
      "name"
    );

    if (!product) {
      res.status(500).json({ success: false });
    }
    res.send(product);
  } catch (error) {
    console.log("Error getting product:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getProductByID = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand")
      .populate("category");
    //populate("category");// Lấy cả phần danh mục

    if (!product) {
      res.status(500).json({ success: false });
    }
    res.send(product);
  } catch (error) {
    console.log(error);
  }
};

const createdProduct = async (req, res) => {
  try {
    const [categoryExist, brandExist] = await Promise.all([
      Category.findById(req.body.category),
      Brand.findById(req.body.brand),
    ]);
    if (!categoryExist || !brandExist) {
      return res.status(400).send("Invalid Category");
    }

    //const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    // const basePath = `/public/uploads/`;
    // const file = req.files && req.files["image"] ? req.files["image"][0] : null;
    // const files = req.files && req.files["images"] ? req.files["images"] : null;

    // if (!file) {
    //   return res.status(400).send("Missing image(s) in the request");
    // }
    // const singleUpload = `${file.filename}`;

    // let imagesPaths = [];

    // if (!files) {
    //   return res.status(400).send("No images in the request");
    // } else {
    //   files.map((file) => imagesPaths.push(`${file.filename}`));
    // }

    // const file = req.files["image"]?.[0];
    // const files = req.files["images"] || [];

    // if (!file) {
    //   return res.status(400).send("No image in the request");
    // }

    // const imagesPaths = images
    //   ? images.map((file) => `${basePath}${file.filename}`)
    //   : [];

    // if (images && images.length > 0 && imagesPaths.length === 0) {
    //   return res.status(400).send("No images in the request");
    // }

    const name = req.body.name;
    let product = await Product.findOne({ name });
    if (product) {
      return res.status(400).json({
        success: false,
        message: "Product is already exist.",
      });
    }

    product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,
      //image: singleUpload,
      //   images: imagesPaths,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product) {
      return res.status(500).send("The product cannot be created");
    }

    res.send(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updatedProduct = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send("Invalid Product Id");
    }

    // const category = await Category1.findById(req.body.category);
    // if (!category) return res.status(400).send("Invalid Category");

    // const brand = await Brand1.findById(req.body.brand);
    // if (!brand) return res.status(400).send("Invalid Category");

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    // const file = req.files["image"] ? req.files["image"][0] : null;
    // const files = req.files["images"] ? req.files["images"] : null;

    const singleUpload = `${basePath}${req.file.filename}`;

    const imagesPaths = [];
    const multipleUpload = req.files.map((file) =>
      imagesPaths.push(`${basePath}${file.filename}`)
    );

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: singleUpload,
        images: multipleUpload,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      {
        new: true,
      }
    );

    if (!product) return res.status(500).send("Product cannot be updated!");

    res.send(product);
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: false,
      message: "Failed",
      err: e,
    });
  }
};

const deletedProduct = async (req, res, next) => {
  try {
    Product.findByIdAndRemove(req.params.id).then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
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

const getCountProduct = async (req, res, next) => {
  try {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
      res.status(500).json({ success: false });
    }
    res.send({
      count: productCount,
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

const getProductFeatured = async (req, res, next) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products) {
      res.status(500).json({ success: false });
    }
    res.send(products);
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
  getAllProduct,
  getProductByID,
  createdProduct,
  updatedProduct,
  deletedProduct,
  getCountProduct,
  getProductFeatured,
  getProductBySlug,
};
