const { Order } = require('../model/orders');
const BaseRepository = require('./base_repository');

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }
}

module.exports = OrderRepository;
