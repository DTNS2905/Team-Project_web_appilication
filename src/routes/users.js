const express = require('express');
const { UserModel } = require('../model/users');
const {  isAuthenticated } = require('../middleware/authenticate');
const container = require('../loaders/register');

const { userService } = container.cradle;
const router = express.Router();

router.get('/profile', isAuthenticated, (req, res) => {
  let status = 200;
  let message = '';
  userService.getById(req.session.userid)
    .then((foundUser) => {
      console.log(foundUser);
      if (foundUser) {
        return res.status(status).render('pages/user_profile', { users: [foundUser], history: [] });
      }

      message = 'Not Found';
      status = 404;
      return res.status(status).render('error', { message, error: { status } });
    })
    .catch((err) => {
      console.error(err);
      res.render('error', { message: 'Server Error', error: { status: 500, stack: err } });
    });
});

router.post('/profile/update', isAuthenticated, (req, res) => {
  let status = 200;
  userService.update(
    req.session.userid,
    {
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      gender: req.body.gender,
      phonenumber: req.body.phonenumber,
      address: req.body.address,
    },
  )
    .then((user) => {
      if (!user) {
        status = 404;
        return res.status(status).render('error', { message: 'Not Found', error: { status: 404 } });
      }
      return res.status(status).redirect('/users/profile');
    });
});
router.get('/profile/history', isAuthenticated, (req, res) => {
  userService.getById({ username: req.session.userid })
    .then((foundUser) => {
      console.log(foundUser);
      if (foundUser) {
        return res.render('pages/history', { users: [foundUser], product: [] });
      }

      return res.render('error', { message: 'Not Found', error: { status: 404 } });
    })
    .catch((err) => {
      console.error(err);
      res.render('error', { message: 'Server Error', error: { status: 500, stack: err } });
    });
});

module.exports = router;
