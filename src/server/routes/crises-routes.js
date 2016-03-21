var mongoose = require('mongoose');
var schemaModule = require('../db/init');
var Crisis = schemaModule.Crisis;
var Super = schemaModule.Super;

var express = require('express');
var router = express.Router();

// #index
router.get('/crises', function(req, res) {
  Crisis
    .find({}, '-villains -heroes', function (err, crises) {
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

          res.send({ data: crisis.publicCrisis() });
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
  if (collection === 'villains')
    q = Crisis.find({ villains: { $ne: superId } }, '-villains -heroes');
  else if (collection === 'heroes')
    q = Crisis.find({ heroes: { $ne: superId } }, '-villains -heroes');
  q.exec(function (err, crises) {
    if (err) console.log(err);

    res.send({ data: crises })
  });
});

// Associating a hero and a crisis (both exist) when a challenge is made
router.put('/:collection/:id/crises/:crisisId', function(req, res) {
  var superId = mongoose.Types.ObjectId(req.params.id);
  var collection = req.params.collection;
  var crisisId = mongoose.Types.ObjectId(req.params.crisisId);
  
  var supersSet;
  if (collection === 'villains')
    supersSet = { villains: superId };
  else if (collection === 'heroes')
    supersSet = { heroes: superId };
  Super
    .findByIdAndUpdate(superId, {
      $addToSet: { crises: crisisId }
    }, function (err) {
      if (err) console.log(err);

      Crisis
        .findByIdAndUpdate(crisisId, {
          $addToSet: supersSet
        }, {
          new: true,
          select: '-villains -heroes'
        }, function (err, crisis) {
          if (err) console.log(err);

          res.send({ data: crisis });
        });
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
      runValidators: true, // TODO: date validation
      select: '-villains -heroes'
    }, function (err, crisis) {
      if (err) console.log(err);

      res.send({ data: crisis });
    });
});

// #delete
router.delete('/crises/:id', function(req, res) {
  var crisisId = mongoose.Types.ObjectId(req.params.id);
  Crisis
    .findById(crisisId, function (err, crisis) {
      if (err) console.log(err);

      superIds = crisis.villains.concat(crisis.heroes);
      Super.update({
        _id: { $in: superIds } 
      }, {
        $pull: { crises: crisis._id }
      }, {
        multi: true
      }, function (err) {
        if (err) console.log(err);
        crisis.remove(function (err) {
          if (err) console.log(err);

          res.send({ data: crisis.publicCrisis() })
        });
      })
    });
});

module.exports = router;
