const { model, Schema } = require("mongoose");

let twitter = new Schema({
  user: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = model(`twitter`, twitter);
