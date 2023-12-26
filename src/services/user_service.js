const PaginationMapper = require('../mappers/pagination_mapper');
const { UserModel } = require('../model/users');
const BaseService = require('./base_service');

class UserService extends BaseService {
  constructor({ userRepository, orderRepository}) {
    super(userRepository, 'users', PaginationMapper.toPagination);
    this.orderRepository = orderRepository;
  }

  authenticate(username, password, onFailed, onSuccess) {
    return this.repo.findOne({ username })
      .then((res) => {
        console.log('Found user:', res);
        if (res) {
          const user = new UserModel({
            username: res.username,
            password: res.password,
          });
          return user.comparePassword(password, (err, isMatch) => {
            if (err || !isMatch) {
              onFailed(err);
            } else {
              onSuccess(res);
            }
          });
        }
        onFailed('Username or password is incorrect');
      });
  }
  
  register(body) {
    return this.repo.create(body);
  }
}

module.exports = UserService;
