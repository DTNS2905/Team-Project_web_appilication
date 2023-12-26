const { asClass, createContainer, InjectionMode } = require('awilix');
const BookRepository = require('../repositories/book_repository');
const PublisherRepository = require('../repositories/publisher_repository');
const AuthorRepository = require('../repositories/author_repository');
const GenreRepository = require('../repositories/genre_repository');
const UserRepository = require('../repositories/user_repository');
const OrderRepository = require('../repositories/order_repository');
const PaymentRepository = require('../repositories/paymnet_repository');
const OrderItemRepository = require('../repositories/order_item_repository');

const BookService = require('../services/book_service');
const UserService = require('../services/user_service');
const OrderService = require('../services/order_service');
const AuthorService = require('../services/author_service');
const PublisherService = require('../services/publisher_service');
const GenreService = require('../services/genre_service');

const BookController = require('../controllers/book_controller');

const {
  UserBodyMapper,
  BookBodyMapper,
  AuthorBodyMapper,
  GenreBodyMapper,
  PublisherBodyMapper,
  OrderBodyMapper,
  OrderItemBodyMapper,
} = require('../mappers/body_mapper');

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

// Repository register
container.register({
  bookRepository: asClass(BookRepository).singleton(),
  publisherRepository: asClass(PublisherRepository).singleton(),
  authorRepository: asClass(AuthorRepository).singleton(),
  genreRepository: asClass(GenreRepository).singleton(),
  userRepository: asClass(UserRepository).singleton(),
  paymentRepository: asClass(PaymentRepository).singleton(),
  orderRepository: asClass(OrderRepository).singleton(),
  orderItemRepository: asClass(OrderItemRepository).singleton(),
});

// Mapper register
container.register({
  bookBodyMapper: asClass(BookBodyMapper).singleton(),
  genreBodyMapper: asClass(GenreBodyMapper).singleton(),
  publisherBodyMapper: asClass(PublisherBodyMapper).singleton(),
  authorBodyMapper: asClass(AuthorBodyMapper).singleton(),
  userBodyMapper: asClass(UserBodyMapper).singleton(),
  orderBodyMapper: asClass(OrderBodyMapper).singleton(),
  orderItemBodyMapper: asClass(OrderItemBodyMapper).singleton(),
});

// Service register
container.register({
  bookService: asClass(BookService).singleton(),
  userService: asClass(UserService).singleton(),
  authorService: asClass(AuthorService).singleton(),
  publisherService: asClass(PublisherService).singleton(),
  genreService: asClass(GenreService).singleton(),
  orderService: asClass(OrderService).singleton(),
});

// Controller register
container.register({
  bookController: asClass(BookController).singleton(),
});

module.exports = container;
