const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
  {
    id: Number,
    message: String,
    title: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);