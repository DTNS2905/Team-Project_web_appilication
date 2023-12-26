const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({

  userid: {
    type: String,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
    max: 99999,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
    max: 99999,
  },
  order_at: {
    type: Date,
    required: true,
  },
});

const Order = mongoose.model('orders', ordersSchema);
module.exports = Order;
