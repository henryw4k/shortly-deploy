var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');
var db = require('../app/config');
var User = require('../app/models/user');
var Url = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Url.find({}, function(err, links) {
    if (err) {(console.log('error fetching links'))}
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  Url.findOne({url:uri}, function(err, result){
    if (err) { console.log(err); }
    else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) { console.log(err); }
        else {
          var newLink = new Url(
            { url: uri,
            base_url: req.headers.origin,
            title: title
            });
        }
        newLink.save(function(err, newLink) {
          if (err) { return console.log(err); }
          res.send(200, newLink); //TO DO: send to links
        });
      }
    );
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  //**Sessions doesn't seem to be working**
  User.findOne({ username: username }, function(err, result) {
    if (result) {
      result.comparePassword(password, function(match){
        if (match) {
          util.createSession(req, res, result);
        }else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, result) {
    if (result) {
      res.render('signup');
    } else {
      var newUser = new User({ username:username, password:password });
      newUser.save(function(err, newUser) {
        if (err) { return console.log(err); }
        res.redirect('/login'); //TO DO: send to links
      });
    }
  });
};

// *** TO DO: refactor below to mongoose ***
exports.navToLink = function(req, res) {
  Url.findOne({ code: req.params[0] }, function(err, link) {
    if (err) {
      console.log('URL is invalid');
      res.redirect('/');
    } else {
      var oldVisits = link.get('visits');
      console.log('type of oldvisits ' + typeof oldVisits);
      link.set('visits', (parseInt(oldVisits)+1))
      .save();
      (function()
        {return res.redirect(link.get('url'));})();
    }
  });
};
