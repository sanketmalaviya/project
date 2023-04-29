const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pid:{
    type: Number
  },
    pName: {
    type: String,
  },
  Description: {
    type: String,
  },
  qty: {
    type: Number,
  },
  price: {
    type: Number,
  },
  img: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports =new mongoose.model("product", productSchema);
