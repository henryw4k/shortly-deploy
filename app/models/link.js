var mongoose = require('mongoose');

var urlSchema = mongoose.Schema({
  title: String,
  url: String,
  base_url: String,
  code: String,
  visits: Number
});

urlSchema.method.createCode = function() {
  var shasum = crypto.createHash('sha1');
  this.url = shasum;
  this.code = shasum.digest('hex').slice(0, 5);
};

exports.Url = mongoose.model('Url', urlSchema);
