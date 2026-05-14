const mongoose = require("mongoose");
const config = require("../configs/config");

mongoose.connect(config.mongoURI);

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String

})

module.exports = mongoose.model("user",userSchema)