var express = require('express');
var app = express();

var PORT = 3001;

app.all('/*', function (req, res) {
  res.send('\
    <!DOCTYPE html>\
    <html>\
      <head>\
        <title>Webpack Integration</title>\
        <script src="polyfills.bundle.js"></script>\
        <script src="main.bundle.js"></script>\
      </head>\
      <body></body>\
    </html>\
  ');
});

app.listen(PORT, function () {
  console.log('Node listening on port:' + PORT);
});