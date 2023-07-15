const express = require("express");
const router = express.Router();
// const uploadFile = require("../../middlewares/multer");
// const middlewareFile = uploadFile.fields([
//   { name: "image", maxCount: 1 },
//   { name: "images", maxCount: 10 },
// ]);

const multer = require("multer");
const fs = require("fs");
const path = require("path");

//setup upload files
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }

    const uploadDir = path.join(__dirname, "..", "..", "/public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    cb(uploadError, uploadDir);
  },
  filename: function (req, file, cb) {
    // const fileName = file.originalname.split(" ").join("-");
    // const extension = FILE_TYPE_MAP[file.mimetype];
    // cb(null, `${fileName}-${Date.now()}.${extension}`);
    //name image in public folder
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//Nếu làm api khác thì khi req sẽ nhận khác nhau
router.post("/", upload.single("image"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Failed");
  }
});

router.post("/collection", upload.array("images", 10), (req, res) => {
  try {
    return res.status(200).json("Files uploaded successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Failed");
  }
});

module.exports = router;
