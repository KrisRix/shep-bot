var http = require('http');

http.createServer(function (req, res) {
  res.write("I'm alive, baby!");
  res.end();
}).listen(8080);