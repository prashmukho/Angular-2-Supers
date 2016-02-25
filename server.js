var express = require('express');
var app = express();

var PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.send('\
    <!DOCTYPE html>\
    <html>\
      <head>\
        <title>Webpack Integration</title>\
      </head>\
      <body>\
        <h1>Hello from webpack dev server!</h1>\
        <script src="bundle.js"></script>\
      </body>\
    </html>\
  ');
});

app.listen(PORT, function () {
  console.log('Node listening on port:' + PORT);
});