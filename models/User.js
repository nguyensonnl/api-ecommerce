const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "First name must be required"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Last name must be required"],
  },
  email: {
    type: String,
    required: [true, "Email must be required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password must be required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

//module.exports = mongoose.model("User", userSchema);
