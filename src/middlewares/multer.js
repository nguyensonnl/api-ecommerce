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

    const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    //cb(uploadError, "src/public/uploads");
    cb(uploadError, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadFile = multer({ storage: storage });
// const fs = require("fs");
// const path = require("path");
// const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

module.exports = uploadFile;
