const express = require("express");
const router = express.Router();
//const CustomerController = require("../controllers/CustomerController");
const { register, login } = require("../../controllers/CustomerController");

router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
