const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
  },
  bookID: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    max: 999,
  },
  price: {
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

const OrderItemsModel = mongoose.model('OrderItems', orderItemSchema);
module.exports = OrderItemsModel;
