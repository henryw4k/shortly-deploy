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
},

usersSchema.methods.hashPassword = function(){
  bcrypt.genSalt(10, function(error, result) {
    this.salt = result;
    bcrypt.hash(this.password, this.salt, null, function(error, res) {
      this.password = res;
    });
  });
};

module.exports = mongoose.model('User', usersSchema);

// var newUser = new User({username: 'a', password: '123', salt: 'salt'});
// newUser.save(function(err, user) {
//   if (err) { console.log(err) }
//     else { console.log('saved!') }

// })
