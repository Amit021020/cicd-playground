const mongoose = require("mongoose");
const config = require("../configs/config");

mongoose.connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String

})

module.exports = mongoose.model("user",userSchema)