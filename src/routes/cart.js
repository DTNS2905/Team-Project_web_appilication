/* eslint-disable no-restricted-syntax */
const express = require('express');
const { isAuthenticated } = require('../middleware/authenticate');

const { PaymentBodyMapper, OrderBodyMapper, OrderItemBodyMapper } = require('../mappers/body_mapper');
const PaymentModel = require('../model/payment');
const OrdersModel  = require('../model/orders');
const OrderItemsModel  = require('../model/order_item');

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
  res.render('pages/cart');
});

router.post('/checkout', isAuthenticated, (req, res) => {
  const { cart } = req.body;
  const jsonCart = JSON.parse(cart);
  let sum = 0.0;
  for (const key in jsonCart) {
    if (Object.hasOwnProperty.call(jsonCart, key)) {
      const element = jsonCart[key];
      const { price, quantity } = element;
      sum += quantity * price;
    }
  }
  const order = new OrdersModel(
    OrderBodyMapper.fromRequest(req, sum, sum),
  );
  order.save()
    .then((newOrder) => {
      if (newOrder) {
        const payment = PaymentModel(
          PaymentBodyMapper.fromRequest(req, newOrder._id, newOrder.total),
        );
        payment.save();
        for (const key in jsonCart) {
          if (Object.hasOwnProperty.call(jsonCart, key)) {
            const element = jsonCart[key];
            const detail = new OrderItemsModel(
              OrderItemBodyMapper.fromRequest(newOrder._id, element),
            );
            detail.save();
          }
        }
      }
      return newOrder;
    }).then((newOrder) => {
      res.redirect('/cart');
    })
    .catch(console.error);
});

module.exports = router;
