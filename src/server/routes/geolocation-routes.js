var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/getAddress', function (req, res, next) {
  var lat = req.query.lat, lng = req.query.lng;
  request('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+process.env.GOOGLE_GEOLOCATION_API_KEY, function (error, resp, body) {
    if (!error && resp.statusCode == 200) {
      res.send({ data: JSON.parse(body) });
    } else {
      res.status(resp.statusCode).send(error)
    }
  })
});

router.get('/getLatLng', function (req, res, next) {
  var address = req.query.address;
  request('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key='+process.env.GOOGLE_GEOLOCATION_API_KEY, function (error, resp, body) {
    if (!error && resp.statusCode == 200) {
      res.send({ data: JSON.parse(body) });
    } else {
      res.status(resp.statusCode).send(error);
    }
  })
});

module.exports = router;