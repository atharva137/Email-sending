const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
 

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
  },
  { collection: "users" }
);

UserSchema.plugin(uniqueValidator);

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;
