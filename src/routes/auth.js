const express = require('express');

const router = express.Router();
const container = require('../loaders/register');
const { UserBodyMapper } = require('../mappers/body_mapper');

const { userService } = container.cradle;

router.get('/', (req, res) => {
  const { session } = req;
  console.log('Sessions: ', session);
  if (session.isAuthenticated) {
    res.status(200).redirect('../');
  } else {
    res.render('forms/auth', { error: '' });
  }
});

router.post('/register', (req, res) => {
  const rawPassword = req.body.password;
  const { confirmPassword } = req.body;
  const newUser = UserBodyMapper.fromRequest(req);
  if (rawPassword !== confirmPassword) {
    res.status(400).render('forms/auth', {
      error: 'Confirm password not match!',
    });
    return;
  }

  userService.register(newUser)
    .catch((err) => {
      console.error(err);
      res.status(400).render('forms/auth', {
        error: err.toString(),
      });
    }).then((user) => {
      if (user) {
        const { session } = req;
        session.userid = user._id;
        session.username = user.username;
        session.role = user.role;
        session.fullname = user.fullname;
        session.isAuthenticated = true;
        console.log(req.session);
        if (user.role == 'admin') {
          res.status(200).redirect('../admin');
        } else {
          res.status(200).redirect('../');
        }
      } else {
        res.status(400).render('forms/auth', {
          error: 'Create user failed',
        });
      }
    });
});

router.post('/login', (req, httpres) => {
  const { username, password } = req.body;
  const { session } = req;
  return userService.authenticate(
    username,
    password,
    (err) => {
      session.isAuthenticated = false;
      httpres.status(401).render('forms/auth', {
        error: err,
      });
    },
    (res) => {
      session.userid = res._id;
      session.username = username;
      session.role = res.role;
      session.email = res.email;
      session.fullname = res.fullname;
      session.address = res.address;
      session.phonenumber = res.phonenumber;
      session.gender = res.gender;
      session.isAuthenticated = true;
      console.log(req.session);
      if (res.role == 'admin') {
        httpres.status(200).redirect('../admin');
      } else {
        httpres.status(200).redirect('../');
      }
    },
  ).catch((err) => {
    console.error(err);
    session.isAuthenticated = false;
    httpres.status(401).render('forms/auth', {
      error: err.toString(),
    });
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).redirect('../auth');
});

module.exports = router;
