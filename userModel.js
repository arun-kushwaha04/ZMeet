const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const users = mongoose.Schema({
 username: {
  type: 'string',
  require: true,
  unique: true,
 },
 password: {
  type: 'string',
  require: true,
 },
});

users.pre('save', function (next) {
 var user = this;
 if (!user.isModified('password')) return next();
 bcrypt.genSalt(10, function (err, salt) {
  if (err) return next(err);
  bcrypt.hash(user.password, salt, (err, hash) => {
   if (err) return next(err);
   user.password = hash;
   next();
  });
 });
});

users.methods.comparePassword = function (candidatePassword, next) {
 bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
  if (err) return next(err);
  next(null, isMatch);
 });
};

module.exports = mongoose.model('User', users);
