const express = require("express");
const router = express.Router();
const admin = require("../model/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/admin-auth");
const Product = require("../model/product");
const multer = require("multer");

//----------------------multer----------------------------------------

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/img");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//-------------------------multer-end---------------------------------

//------------------------ admin--------------------------------------
router.get("/A_index", auth, (req, resp) => {
  resp.render("A_index");
});

router.get("/A_login", (req, resp) => {
  resp.render("A_login");
});

router.post("/admin-login", async (req, resp) => {
  const email = req.body.email;
  const pass = req.body.pass;

  try {
    const adminData = await admin.findOne({ email: email });
    const adminValid = await bcrypt.compare(pass, adminData.pass);

    if (adminValid) {
      const token = await jwt.sign({ id: adminData._id }, process.env.atoken);
      resp.cookie("jwt", token);
      resp.render("A_index");
    } else {
      resp.render("A_login", { msg: "Login invalid" });
    }
  } catch (error) {
    resp.render("A_login", { msg: "Login invalid" });
  }
});

router.post("/admin-add", async (req, resp) => {
  try {
    const Admin = await admin(req.body);
    const data = await Admin.save();
    resp.send(data);
  } catch (error) {
    resp.send(error);
  }
});
router.get("/logoutAll", (req, resp) => {
  resp.clearCookie("jwt");
  resp.render("A_login");
});

router.get("/products", auth, (req, resp) => {
  resp.render("products");
});

router.get("/add-product", auth, (req, resp) => {
  resp.render("add-product");
});

router.post("/add-product", upload.single("file"), async (req, resp) => {
  const pid = await req.body.id;
  try {
    if (pid == "") {
      const product = await Product({
        pid: req.body.pid,
        pName: req.body.Pname,
        Description: req.body.Description,
        qty: req.body.qty,
        price: req.body.price,
        img: req.file.filename,
      });
      const productAdded = await product.save();
      if (productAdded) {
        resp.render("add-product", {
          msg: productAdded.pName + " " + "Added successful",
        });
      }
    } else {
      const result = await Product.findByIdAndUpadte(pid, {
        pid: req.body.pid,
        pName: req.body.Pname,
        Description: req.body.Description,
        qty: req.body.qty,
        price: req.body.price,
        img: req.file.filename,
      });
      const pdata = await Product.find();
      resp.render("productdetaile", { pdetail: pdata });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/productdetaile", async (req, resp) => {
  try {
    const productdetaile = await Product.find();

    resp.render("productdetaile", { pdetail: productdetaile });
  } catch (error) {
    console.log(error);
  }
});
  
  

router.get("/productdelete", async (req, res) => {
  const pid = req.query.did;

  try {
    const data = await Product.findByIdAndDelete(pid);
    console.log(data);
    const productdetaile = await Product.find();
    res.render("productdetaile", { pdetaile: productdetaile });
  } catch (error) {
    console.log(error);
  }
});
router.get("/edit-product", async (req, res) => {
  const pid = req.query.pid;

  try {
    const pdetaile = await Product.findById(pid);
    res.render("add-product", { pdata: pdetaile });
  } catch (error) {
    console.log(error);
  }
});


router.get("/accounts", auth, (req, resp) => {
  resp.render("accounts");
});

router.get("/A_forgot-password", (req, resp) => {
  resp.render("A_forgot-password");
});

//------------------------------admin-end--------------------------------

//-----------------------------product ------------------------------

module.exports = router;
