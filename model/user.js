  const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },

  email: {
    type: String,
    require: true,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    require: true,
    trim: true,
  },  
  date: {
    type: Date,
    default: Date.now(),
  
  },
  });

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  } catch (error) {
    console.log(error);
  }
});



module.exports = new mongoose.model("user",userSchema)
 
