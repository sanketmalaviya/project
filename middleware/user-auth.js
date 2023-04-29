const jwt = require("jsonwebtoken");
const User = require("../model/user");

const auth = async (req, resp, next) => {
  const token = req.cookies.jwt;
  try {
    const data = await jwt.verify(token, process.env.token);
    if (data) {
      const userData = await User.findOne({ _id: data._id });
      req.user = userData;
      next();
    } else {
      resp.render("login", { err: "please login" });
    }
  } catch (error) {
    resp.render("login", { err: "please login" });
  }
};
module.exports = auth;
