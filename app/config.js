var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var crypto = require('crypto');


mongoose.connect('mongodb://localhost/shortlyDb');
var db = mongoose.connection;

module.exports = db;
