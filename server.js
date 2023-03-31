const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./config/dbConnect");
dbConnect();
const routes = require("./routes/api/index");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Upload static files
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.get("/", (req, res) => res.send("Server ON"));
app.use("/api/v1", routes);

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server is running on the port: ${port}`);
});
