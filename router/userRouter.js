const express = require("express"); 
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/user-auth");

router.get("/", (req, resp) => {
  resp.render("index");
});

router.get("/login", (req, resp) => {
  resp.render("login");
});

router.get("/registration", (req, resp) => {
  resp.render("registration");
});

router.post("/useradd", async (req, resp) => {
  try {
    const { name, password, email, phoneNumber } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      resp.render("registration", { msg: "Email Already exists" });
    } else {
      if (name && password && email && phoneNumber) {
        const doc = new User({
          name: name,
          password: password,
          email: email,  
          phoneNumber: phoneNumber,
        });
        await doc.save();
        resp.render("registration", { succ: "Registration Success" });
      } else {
        resp.render("registration", { err: "All Data Are Require" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/userlogin", async (req, resp) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userData = await User.findOne({email: email});
    const valid = await bcrypt.compare(password, userData.password);
    const token = await jwt.sign({ id: userData._id }, process.env.token);
    if (valid) {
      resp.cookie("jwt", token);
      resp.render("index", { user: userData.email });
    } else {
      resp.render("login", { msg: "Login invalid" });
    }
  } catch (error) {
    resp.render("login", { msg: "Login invalid" });
  }
});

router.get("/logout", (req, resp) => {
  resp.clearCookie("jwt");
  resp.render("login");
});
router.get("/shop-grid", (req, resp) => {
  resp.render("shop-grid");
});
router.get("/checkout", (req, resp) => {
  resp.render("checkout");
});
router.get("/contact", (req, resp) => {
  resp.render("contact");
});
router.get("/main", (req, resp) => {
  resp.render("main");
});
router.get("/shop-details", (req, resp) => {
  resp.render("shop-details");
});
router.get("/shop-grid", (req, resp) => {
  resp.render("shop-grid");
});
router.get("shopp-cart", (req, resp) => {
  resp.render("shop-cart");
});
router.get("/blog", (req, resp) => {
  resp.render("blog");
});

module.exports = router;
