const mongoose = require('mongoose');

const authorsSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 20,
  },
  date_of_birth: {
    type: Date,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  phonenumber: {
    type: Number,
    required: false,
  },

});
const author = mongoose.model('Author', authorsSchema);
exports.AuthorModel = author;
