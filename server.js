var app = require('./server-config.js');

var port = process.env.PORT || 3000;
var host = process.env.host || '127.0.0.1';

app.listen(port);

console.log('Server now listening on port ' + port);
