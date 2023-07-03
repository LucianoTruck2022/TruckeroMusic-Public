const { model, Schema } = require("mongoose");

let sugSchema = new Schema({
  messageID: String,
  si: { type: Array, default: [] },
  no: { type: Array, default: [] },
  autor: { type: String, default: "" },
});

module.exports = model(`sugSchema`, sugSchema);