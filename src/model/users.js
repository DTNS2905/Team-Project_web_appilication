const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    default: 'customer',
  },
  fullname: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 20,
  },
  gender: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    minLength: 8,
    maxLength: 20,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 255,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  phonenumber: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },

});

UserSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(12, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, false);
    }
    return cb(null, isMatch);
  });
};

const User = mongoose.model('User', UserSchema);
exports.UserModel = User;
