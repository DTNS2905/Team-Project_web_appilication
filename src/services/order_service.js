const BaseService = require("./base_service");
const PaginationMapper = require('../mappers/pagination_mapper');

class OrderService extends BaseService {
    constructor({ orderRepository, orderItemRepository, paymentRepository, userRepository }) {
        super(orderRepository, 'order', PaginationMapper.toPagination);
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    getPage(page = 1, perPage = 10, sort = { _id: 1 }) {
        const aggregate = [
            {
                $lookup: {
                    from: 'orderitems',
                    localField: '_id',
                    foreignField: 'orderID',
                    as: 'orderitems',
                },
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'payments',
                },
            },
            {
                $addFields: {
                    price: { $first: '$orderitems' },
                    quantity: {$first: 'orderitems'}
                },
                $addFields: {
                    payments: { $first: '$payments' },
                },
            },
            {
                $set: {
                    price: { $ifNull: ['$orderitems.price', null] },
                    quantity: { $ifNull: ['$orderitems.quantity', null] },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'users',
                }
            },
            {
                $addFields: {
                    users:{ $first: '$users' }
                }
            },
            {
                $set: {
                    username:{$ifNull: ['$users.username', null]}
                }
            }
        ];
        console.log( this.repo);
        return Promise.all([
            this.repo.aggregate(aggregate)
                .sort(sort)
                .skip((perPage * page) - perPage)
                .limit(perPage),
            this.repo.count({}),
        ]).then(([orderitems ,orders , orderCount]) => {
            const result = {};
            result[this.name] = PaginationMapper.toPagination(orders, orderCount, page, perPage);
            result.orderitems = orderitems
            console.log(result);
            return result;
            
        });
    }

}

module.exports = OrderService;
