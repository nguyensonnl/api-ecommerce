const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!(firstName && lastName && email && password && phone)) {
      res.status(400).send("All input is required");
    }

    const oldUser = await Customer.findOne({ email });
    if (oldUser) {
      res.status(409).send("Customer Already Exist. Please Login!");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    let customer = await Customer.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
      phone,
    });

    res.status(200).json({
      message: "Success",
      data: {
        customer,
      },
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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    let customer = await Customer.findOne({ email });
    if (customer && (await bcrypt.compare(password, customer.password))) {
      const accessToken = jwt.sign(
        { customerId: customer._id, email },
        process.env.TOKEN_SECRET_KEY
        // { expiresIn: "2h" }
      );

      res.status(200).json({ customer, accessToken });
    } else {
      res.status(400).send("Email or Password Invalid");
    }
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
  register,
  login,
};
