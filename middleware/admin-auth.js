const jwt = require("jsonwebtoken");
const admin = require("../model/admin");

const auth = async (req, resp, next) => {
  const token = req.cookies.jwt;

  try {
    const data = await jwt.verify(token, process.env.atoken);

    if (data) {
      const adminData = await admin.findOne({ _id: data._id });
      req.admin = adminData;
      next();
    } else {
      resp.render("A_login", { err: "please login" });
    }
  } catch (error) {
    resp.render("A_login", { err: "please login" });
    console.log(error);
  }
};
module.exports = auth;
