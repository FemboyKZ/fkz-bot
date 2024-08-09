const { model, Schema } = require("mongoose");

let roles = new Schema({
  Guild: String,
  Role: String,
  Name: String,
  Permissions: String,
  Color: String,
  Hoisted: Boolean,
  Creator: String,
  Created: Date,
});

module.exports = model("roles", roles);
