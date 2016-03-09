var express = require('express');
var router = express.Router();

router.get('/fbAppID', function(req, res) {
  res.send({ id: process.env.FB_APP_ID });
});

router.get('/googleClientID', function(req, res) {
  res.send({ id: process.env.GOOGLE_CLIENT_ID });
});

module.exports = router;