// var Bookshelf = require('bookshelf');
// var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var crypto = require('crypto');
mongoose.connect('mongodb://localhost/shortlyDb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(callback){


// ----------------URL--------------------------------
  var urlSchema = mongoose.Schema({
    title: String,
    url: String,
    base_url: String,
    code: String,
    visits: Number
  });

  var Url = mongoose.model('Url', urlSchema);

  urlSchema.method.createCode = function() {
    var shasum = crypto.createHash('sha1');
    this.url = shasum;
    this.code = shasum.digest('hex').slice(0, 5);
  };


// ------------USERS------------------------------------
  var usersSchema = mongoose.Schema({
    username: String,
    password: String,
    salt: String
  });

  var User = mongoose.model('User', usersSchema);

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

});

module.exports = db;
