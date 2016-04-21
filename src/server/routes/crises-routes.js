var mongoose = require('mongoose'), 
    schemaModule = require('../db/init'), 
    Crisis = schemaModule.Crisis, 
    Super = schemaModule.Super;

var express = require('express'), 
    router = express.Router();

var errors = require('./errors');
var pluralize = require('pluralize');

// #index
router.get('/crises', function (req, res, next) {
  Crisis
    .find()
    .populate('villains heroes')
    .exec(function (err, crises) {
      if (err) return next(err);

      crises = crises.map(function (crisis) {
        var danger = crisis.villains.reduce(function (total, villain) {
          return total + Number(villain.power.strength);
        }, 0);
        danger = crisis.heroes.reduce(function (total, hero) {
          return total - Number(hero.power.strength);
        }, danger);
        crisis = crisis.publicCrisis();
        crisis.danger = Math.max(danger, 0);
        return crisis;
      });

      res.send({ data: crises });
    });
});

// Creating a Crisis doc via a villain and adding it to 
// the villain's crises array as a ref
router.post('/villains/:villainId/crises', function (req, res, next) {
  if (!errors.isHex24(req.params.villainId)) {
    return errors.error400(res);
  }

  var villainId = mongoose.Types.ObjectId(req.params.villainId);
  Super
    .findById(villainId, function (err, villain) {
      if (err) return next(err);
      if (!villain) return errors.error404(res, villainId);

      var crisis = new Crisis(req.body.crisis);
      crisis.villains.push(villain);
      crisis.save(function (err) {
        if (err) return errors.error500(res, 'save crisis', err.errors);

        villain.crises.push(crisis);
        villain.save(function (err) {
          if (err) return errors.error500(res, 'update villain', err.errors);

          res.send({ data: crisis.publicCrisis() });
        });
      });
    });
});

// #read
router.get('/crises/:id', function (req, res, next) {
  if (!errors.isHex24(req.params.id)) {
    return errors.error400(res);
  }

  var crisisId = mongoose.Types.ObjectId(req.params.id);
  Crisis
    .findOne({ _id: crisisId }, '-__v')
    .populate('villains heroes')
    .exec(function (err, crisis) {
      if (err) return next(err);
      if (!crisis) return errors.error404(res, crisisId);

      ['villains', 'heroes'].forEach(function (category) {
        crisis[category] = crisis[category].map(function (s) {
          return s.publicSuper();
        });
      });

      res.send({ data: crisis });
    });
});

// Get crises that a hero/villain is not already engaged in
router.get('/:collection/:superId/crises/uninvolved', function (req, res, next) {
  if (!errors.isHex24(req.params.superId)) {
    return errors.error400(res);
  }

  var superId = mongoose.Types.ObjectId(req.params.superId);
  var collection = req.params.collection;
  if (collection !== 'villains' && collection !== 'heroes') return errors.error400(res);
  
  var uninvolvedSet,
      project = '-villains -heroes -__v', 
      include = { $ne: superId };
  if (collection === 'villains')
    uninvolvedSet = { villains: include };
  else if (collection === 'heroes')
    uninvolvedSet = { heroes: include };

  Crisis
    .find(uninvolvedSet, project)
    .exec(function (err, crises) {
      if (err) return next(err);

      res.send({ data: crises })
    });
});

// Associating a hero and a crisis (both exist) when a challenge is made
router.put('/:collection/:superId/crises/:crisisId', function (req, res) {
  if (!isHex24(req.params.superId) || !isHex24(req.params.crisisId)) {
    return errors.error400(res);
  }

  var superId = mongoose.Types.ObjectId(req.params.superId), 
      crisisId = mongoose.Types.ObjectId(req.params.crisisId), 
      collection = req.params.collection;
  if (collection !== 'villains' && collection !== 'heroes') return errors.error400(res);
      
  var supersSet;
  if (collection === 'villains')
    supersSet = { villains: superId };
  else if (collection === 'heroes')
    supersSet = { heroes: superId };

  Super
    .findByIdAndUpdate(superId, {
      $addToSet: { crises: crisisId }
    }, function (err, superDoc) {
      if (err) return errors.error500(res, 'update '+pluralize(collection, 1), err.errors);
      if (!superDoc) return errors.error404(res, superId);

      Crisis
        .findByIdAndUpdate(crisisId, {
          $addToSet: supersSet
        }, {
          new: true,
          select: '-villains -heroes -__v'
        }, function (err, crisis) {
          if (err) return errors.error500(res, 'update crisis', err.errors);
          if (!crisis) return errors.error404(res, crisisId);

          res.send({ data: crisis });
        });
    });
});

// #update
router.put('/crises/:id', function (req, res) {
  if (!errors.isHex24(req.params.id)) {
    return errors.error400(res);
  }

  var crisisId = mongoose.Types.ObjectId(req.params.id);
  Crisis
    .findByIdAndUpdate(crisisId, { 
      $set: req.body.crisis 
    }, {
      new: true, // return updated object
      runValidators: true, // TODO: date validation
      select: '-villains -heroes -__v'
    }, function (err, crisis) {
      if (err) return errors.error500(res, 'update crisis', err.errors);
      if (!crisis) return errors.error404(res, crisisId);

      res.send({ data: crisis });
    });
});

// #delete
router.delete('/crises/:id', function (req, res, next) {
  if (!errors.isHex24(req.params.id)) {
    return errors.error400(res);
  }

  var crisisId = mongoose.Types.ObjectId(req.params.id);
  Crisis
    .findById(crisisId, function (err, crisis) {
      if (err) return next(err);
      if (!crisis) return errors.error404(res, crisisId);

      crisis.remove(function (err) {
        if (err) next(err);

        superIds = crisis.villains.concat(crisis.heroes);
        Super.update({
          _id: { $in: superIds } 
        }, {
          $pull: { crises: crisis._id }
        }, {
          multi: true
        }, function (err) {
          if (err) next(err);

          res.send({ data: crisis.publicCrisis() })
        })
      });
    });
});

module.exports = router;
