const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, maxlength: 40 },
  email: { type: String, required: true },
  password: { type: String },
  balance: { type: Number, required: true, default: 1000 },
});

module.exports = mongoose.model("User", UserSchema);
