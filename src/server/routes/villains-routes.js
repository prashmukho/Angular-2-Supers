var mongoose = require('mongoose');
var Super = require('../db/init').Super;

var express = require('express');
var router = express.Router();

// #index
router.get('/villains', function(req, res) {
  Super
    .find({ 
      category: 'villain' 
    }, '-category -crises', 
    function (err, villains) {
      if (err) console.log(err);
      res.send({ data: villains });
    });
});

// #create
router.post('/villains', function(req, res) {
  var input = req.body.villain;
  input['category'] = 'villain';
  var villain = new Super(input);
  villain.save(function (err) {
    if (err) console.log(err);
    res.send({ 
      // not sending fields - category, crises
      data: {
        _id: villain._id,
        name: villain.name,
        power: villain.power,
        alias: villain.alias
      }
    });
  });
});

// #read
router.get('/villains/:id', function(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  Super
    .findById(id, '-category -crises', function (err, villain) {
      if (err) console.log(err);
      res.send({ data: villain });
    });
});

// #update
router.put('/villains/:id', function(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  Super
    .findByIdAndUpdate(id, { 
      $set: req.body.villain 
    }, {
      new: true, // return updated object
      runValidators: true, 
      select: '-category -crises'
    }, function (err, villain) {
      if (err) console.log(err);
      res.send({ data: villain });
    });
});

// #delete
router.delete('/villains/:id', function(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  Super
    .findByIdAndRemove(id, {
      select: '-category -crises'
    }, function (err, villain) {
      if (err) console.log(err);
      res.send({ data: villain });
    });
});

module.exports = router;
