var mongoose = require('mongoose');
var Villain = require('server/db/init').Villain;

var express = require('express');
var router = express.Router();

router.get('/villains', function(req, res) {
  Villain.find(function(err, results) {
    if (err) { console.log(err); }

    res.send({ data: results });
  });
});

router.post('/villains', function(req, res) {
  var villain = new Villain(req.body.villain);
  villain.save(function (err) {
    if (err) console.log(err);

    res.send({ data: villain });
  });
});

router.get('/villains/:id', function(req, res) {
  var id = req.params.id;
  Villain.findOne({ _id: mongoose.Types.ObjectId(id) }, function(err, result) {
    if (err) { console.log(err); }

    res.send({ data: result });
  });
});

router.put('/villains/:id', function(req, res) {
  var id = req.params.id;
  Villain.update({ _id: mongoose.Types.ObjectId(id) }, {
    $set: req.body.villain
  }, function(err) {
    if (err) { console.log(err); }

    res.send({ data: id });
  });
});

module.exports = router;
