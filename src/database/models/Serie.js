const { model, Schema } = require("mongoose");

const SerieSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const Serie = model("Serie", SerieSchema, "serie");

module.exports = Serie;
