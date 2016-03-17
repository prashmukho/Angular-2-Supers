var mongoose = require('mongoose');
var schemaModule = require('../db/init');
var Crisis = schemaModule.Crisis;
var Super = schemaModule.Super;

var express = require('express');
var router = express.Router();

// #index
router.get('/crises', function(req, res) {
  Crisis
    .find(function (err, crises) {
      if (err) console.log(err);
      res.send({ data: crises });
    });
});

// Creating a Crisis doc via a villain and adding it to 
// the villain's crises array as a ref
router.post('/villains/:id/crises', function(req, res) {
  var villainId = mongoose.Types.ObjectId(req.params.id);
  Super
    .findById(villainId, function (err, villain) {
      if (err) console.log(err);
      
      var crisis = new Crisis(req.body.crisis);
      crisis.villains.push(villain);
      crisis.save(function (err) {
        if (err) console.log(err);

        villain.crises.push(crisis);
        villain.save(function (err) {
          if (err) console.log(err);
        });
        res.send({ data: crisis });
      });
    });
});

// #read
router.get('/crises/:id', function(req, res) {
  var crisisId = mongoose.Types.ObjectId(req.params.id);
  Crisis
    .findOne({ _id: crisisId })
    .populate('villains heroes')
    .exec(function (err, crisis) {
      if (err) console.log(err);
      res.send({ data: crisis });
    });
});

// Adding a Crisis doc to a hero's crises array as a ref
// router.post('/heroes/:id/crises', function(req, res) {
//   var heroId = mongoose.Types.ObjectId(req.params.id);
// });

// #update
router.put('/crises/:id', function(req, res) {
  var crisisId = mongoose.Types.ObjectId(req.params.id);
  Crisis
    .findByIdAndUpdate(crisisId, { 
      $set: req.body.crisis 
    }, {
      new: true, // return updated object
      runValidators: true
    }, function (err, crisis) {
      if (err) console.log(err);
      res.send({ data: crisis });
    });
});

module.exports = router;
