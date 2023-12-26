const { OrderItemsModel } = require('../model/order_item');
const BaseRepository = require('./base_repository');

class OrderItemRepository extends BaseRepository {
  constructor() {
    super(OrderItemsModel);
  }
}

module.exports = OrderItemRepository;
