const { model, Schema, SchemaTypes } = require("mongoose");

const PlatformSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  series: {
    type: [SchemaTypes.ObjectId],
    ref: "Serie",
  },
});

const Platform = model("Platform", PlatformSchema, "platform");

module.exports = Platform;
