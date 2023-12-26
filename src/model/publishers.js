const mongoose = require('mongoose');

const publishersSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 20,
  },
  country: {
    type: String,
    required: true,
  },

});
const publisher = mongoose.model('Publisher', publishersSchema);
exports.PublisherModel = publisher;
