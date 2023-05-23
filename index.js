const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./src/config/dbConnect");
dbConnect();
const routes = require("./src/routes/api/index");

const app = express();

//Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "https://lamsonwatch.vercel.app/");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.use(cors({ origin: true }));
//app.use(cors());
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
