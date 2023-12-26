const PaymentModel = require('../model/payment');
const BaseRepository = require('./base_repository');

class PaymentRepository extends BaseRepository {
  constructor() {
    super(PaymentModel);
  }
}

module.exports = PaymentRepository;
