var path = require('path');
var express = require('express');
var stormpath = require('express-stormpath');

var PORT = process.env.PORT || 3000;

var app = express();
app.use(stormpath.init(app, {
  web: {
    register: {
      form: {
        fields: {
          givenName: {
            required: false
          },
          surname: {
            required: false
          }
        }
      }
    },
    produces: ['application/json']
  },
  debug: 'info, error'
}));

// Once Stormpath has initialized itself, start your web server!
app.on('stormpath.ready', function () {
  console.log('Node listening on port:' + PORT);
  app.listen(PORT);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
