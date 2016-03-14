var mongoose = require('mongoose');
var Villain = require('../db/init').Villain;

var express = require('express');
var router = express.Router();

// #index
router.get('/villains', function(req, res) {
  Villain.find(function(err, villains) {
    if (err) { console.log(err); }

    res.send({ data: villains });
  });
});

// #create
router.post('/villains', function(req, res) {
  var villain = new Villain(req.body.villain);
  villain.save(function (err) {
    if (err) console.log(err);

    res.send({ data: villain });
  });
});

// #read
router.get('/villains/:id', function(req, res) {
  var id = req.params.id;
  Villain.findOne({ _id: mongoose.Types.ObjectId(id) }, function(err, villain) {
    if (err) { console.log(err); }

    res.send({ data: villain });
  });
});

// #update
router.put('/villains/:id', function(req, res) {
  var id = req.params.id;
  Villain.update({ _id: mongoose.Types.ObjectId(id) }, {
    $set: req.body.villain
  }, function(err) {
    if (err) { console.log(err); }

    res.send({ data: id });
  });
});

// #delete
router.delete('/villains/:id', function(req, res) {
  var id = req.params.id;
  Villain.remove({ _id: mongoose.Types.ObjectId(id) }, function(err) {
    if (err) { console.log(err); }

    res.send({ data: id });
  });
});

module.exports = router;
