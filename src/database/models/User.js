const { model, Schema, SchemaTypes } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  series: [SchemaTypes.ObjectId],
});

const User = model("User", UserSchema, "users");

module.exports = User;
