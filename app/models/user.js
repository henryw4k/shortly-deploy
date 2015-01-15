var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  salt: String
});

usersSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

usersSchema.methods.hashPassword = function(next){
  var user = this;
  bcrypt.genSalt(10, function(error, result) {
    user.set('salt', result);
    bcrypt.hash(user.get('password'), user.get('salt'), null, function(error, res) {
      console.log('got into hash');
      user.set('password', res);
      next();
    });
  });
};

usersSchema.pre('save', function(next) {
  this.hashPassword(next);
  console.log(this.password);
});


var User = mongoose.model('User', usersSchema);
module.exports = User;

// var newUser = new User({username: 'a', password: '123', salt: 'salt'});
// newUser.save(function(err, user) {
//   if (err) { console.log(err) }
//     else { console.log('saved!') }

// })
