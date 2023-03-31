const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      res.status(400).json({
        success: false,
        message: "User already exist. Please login!",
      });
      //throw new Error("User already exist. Please login!");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    });

    return res.status(200).json({
      message: "Success",
      user,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    let user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        { userId: user._id, email },
        process.env.TOKEN_SECRET_KEY
        // { expiresIn: "2h" }
      );

      return res.status(200).json({ user, accessToken });
    } else {
      return res.status(400).send("Invalid information");
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

module.exports = { register, login };
