require('dotenv').config();
var path = require('path');
var express = require('express');
var stormpath = require('express-stormpath');
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'src', 'app', 'assets')));
app.use(stormpath.init(app, {
  web: {
    register: {
      form: {
        fields: {
          givenName: {
            required: false,
            // enabled: false
          },
          surname: {
            required: false,
            // enabled: false
          }
        }
      }
    },
    produces: ['application/json']
  },
  debug: (process.env === 'development' ? 'info, error' : 'error')
}));

// Once Stormpath has initialized itself, start your web server!
app.on('stormpath.ready', function () {
  console.log('Node listening on port:' + PORT);
  app.listen(PORT);
});

var routes = require('./src/server/routes');
routes(app);

app.all('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});