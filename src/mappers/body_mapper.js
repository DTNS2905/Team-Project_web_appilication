/* eslint-disable max-classes-per-file */
class BookBodyMapper {
  static fromRequest(req) {
    return {
      title: req.body?.title,
      authorId: req.body?.authorId,
      publisherId: req.body?.publisherId,
      genre: req.body?.genre,
      price: req.body?.price,
      image: req.file?.path?.replace('public', '')?.replaceAll('\\', '/'),
    };
  }
}

class AuthorBodyMapper {
  static fromRequest(req) {
    return {
      fullname: req.body?.fullname,
      date_of_birth: req.body?.date_of_birth,
      phonenumber: req.body?.phonenumber,
      address: req.body?.address,
    };
  }
}

class PublisherBodyMapper {
  static fromRequest(req) {
    return {
      fullname: req.body?.fullname,
      country: req.body?.country,
    };
  }
}

class GenreBodyMapper {
  static fromRequest(req) {
    return {
      title: req.body.fullname,
      description: req.body.description,
    };
  }
}

class UserBodyMapper {
  static fromRequest(req) {
    return {
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
  }
}

class PaymentBodyMapper {
  static fromRequest(req, orderId, total) {
    return {
      userId: req.session.userid,
      orderId,
      country: req.body.country,
      state: req.body.state,
      zip: req.body.zip,
      payment_type: req.body.payment_type,
      pay_at: new Date(),
      total,
    };
  }
}

class OrderBodyMapper {
  static fromRequest(req, subtotal, total) {
    return {
      userid: req.session.userid,
      subtotal,
      total,
      order_at: new Date(),
    };
  }
}

class OrderItemBodyMapper {
  static fromRequest(orderId, element) {
    const { book_id, price, quantity } = element;
    return {
      orderID: orderId,
      bookID: book_id,
      price,
      quantity,
      order_at: new Date(),
    };
  }
}

module.exports = {
  UserBodyMapper,
  BookBodyMapper,
  AuthorBodyMapper,
  GenreBodyMapper,
  PublisherBodyMapper,
  PaymentBodyMapper,
  OrderBodyMapper,
  OrderItemBodyMapper,
};
