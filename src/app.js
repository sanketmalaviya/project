const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRouter = require("../router/userRouter");
const adminRouter = require("../router/adminRouter");
require("dotenv").config();
const port = process.env.port;
app.listen(port, () => {
  console.log("Server Running " + port);
});

const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL).then(() => {
  console.log("DB Connected");
});

const viewPath = path.join(__dirname, "../templete/view");
const partialPath = path.join(__dirname, "../templete/partial");
const publicPath = path.join(__dirname, "../public");

app.set("view engine", "hbs");
app.set("views", viewPath);

hbs.registerPartials(partialPath);

app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/", userRouter);
app.use("/", adminRouter);
