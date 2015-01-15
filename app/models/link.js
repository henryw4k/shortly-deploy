var mongoose = require('mongoose');
var crypto = require('crypto');


var urlSchema = mongoose.Schema({
  title: String,
  url: String,
  base_url: String,
  code: String,
  visits: { type: Number }
});

urlSchema.methods.createCode = function(next) {
  var shasum = crypto.createHash('sha1');
  console.log('shasum is: ' + shasum);
  shasum.update(this.get('url'));
  this.set('code', shasum.digest('hex').slice(0, 5));
  next();
};

urlSchema.pre('save', function(next) {
  if (!this.get('visits')) {
    this.set('visits',0);
  }
  this.createCode(next);
});

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;
