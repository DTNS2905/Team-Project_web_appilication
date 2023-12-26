const mongoose = require('mongoose');

const paymnetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
  zip: {
    type: String,
    require: true,
  },
  payment_type: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
    max: 99999,
  },
  pay_at: {
    type: Date,
    required: true,
  },
});

const PaymentModel = mongoose.model('payments', paymnetSchema);
module.exports = PaymentModel;
