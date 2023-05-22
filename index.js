const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./src/config/dbConnect");
dbConnect();
const routes = require("./src/routes/api/index");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static files
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//define routes
app.use("/api/v1", routes);

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server is running on the port: ${port}`);
});
