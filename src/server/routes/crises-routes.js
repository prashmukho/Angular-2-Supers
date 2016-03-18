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
          res.send({ data: crisis });
        });
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

// Get crises that a hero/villain is not already engaged in
router.get('/:collection/:id/crises/uninvolved', function (req, res) {
  var superId = mongoose.Types.ObjectId(req.params.id);
  var collection = req.params.collection;
  var q;
  if (collection === 'heroes') {
    q = Crisis.find({ heroes: { $ne: superId } });
  } else if (collection === 'villains') {
    q = Crisis.find({ villains: { $ne: superId } });
  }
  q.exec(function (err, crises) {
    if (err) console.log(err);
    res.send({ data: crises })
  });
});

// Associating a hero and a crisis (both exist) when a challenge is made
router.put('/heroes/:heroId/crises/:crisisId', function(req, res) {
  var heroId = mongoose.Types.ObjectId(req.params.heroId);
  var crisisId = mongoose.Types.ObjectId(req.params.crisisId);
  Super
    .findByIdAndUpdate(heroId, {
      $addToSet: { crises: crisisId }
    }, {
      new: true
    }, function (err, hero) {
      if (err) console.log(err);
      Crisis
        .findByIdAndUpdate(crisisId, {
          $addToSet: { heroes: heroId }
        }, {
          new: true
        }, function (err, crisis) {
          if (err) console.log(err);
          res.send({ data: { hero: hero, crisis: crisis } });
        })
    });
});

// #update
router.put('/crises/:id', function(req, res) {
  var crisisId = mongoose.Types.ObjectId(req.params.id);
  Crisis
    .findByIdAndUpdate(crisisId, { 
      $set: req.body.crisis 
    }, {
      new: true, // return updated object
      runValidators: true // TODO: date validation
    }, function (err, crisis) {
      if (err) console.log(err);
      res.send({ data: crisis });
    });
});

module.exports = router;
