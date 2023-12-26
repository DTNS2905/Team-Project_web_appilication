const isAuthenticated = (req, res, next) => {
  const { session } = req;
  if (session.isAuthenticated) {
    res.locals = req.session;
    res.locals.username = session.username;
    res.locals.userid = session.userid;
    res.locals.fullname = session.fullname;
    res.locals.email = session.email;
    res.locals.phonenumber = session.phonenumber;
    res.locals.address = session.address;
    res.locals.role = session.role;
    next();
  } else {
    res.status(401).redirect('/auth');
  }
};

const hasAdminRole = (req, res, next) => {
  const { session } = req;
  if (session.isAuthenticated) {
    const { role } = session;
    if (role === 'admin') {
      res.locals.username = session.username;
      res.locals.userid = session.userid;
      res.locals.fullname = session.fullname;
      res.locals.email = session.email;
      res.locals.phonenumber = session.phonenumber;
      res.locals.address = session.address;
      res.locals.role = session.role;
      next();
    } else {
      res.status(403).redirect('/');
    }
  } else {
    res.status(401).redirect('/auth');
  }
};

exports.isAuthenticated = isAuthenticated;
exports.hasAdminRole = hasAdminRole;
