var mongoose = require('mongoose'), 
    schemaModule = require('../db/init'), 
    Crisis = schemaModule.Crisis, 
    Super = schemaModule.Super;

var express = require('express'), 
    router = express.Router();

var errors = require('./errors');
var pluralize = require('pluralize');

// :collection refers to a category-based collection for making 
// REST-like requests to a single real collection of supers
// eg. /heroes/... for handling { category: 'heroes' } and so on.

// #index
router.get('/:collection', function (req, res, next) {
  var collection = req.params.collection;
  if (collection !== 'villains' && collection !== 'heroes') return next();

  Super
    .find({ 
      category: pluralize(collection, 1)
    }, '-category -crises -__v')
    .exec(function (err, supers) {
      if (err) return next(err);

      res.send({ data: supers });
    });
});

// #create
router.post('/:collection', function (req, res, next) {
  var collection = req.params.collection;
  if (collection !== 'villains' && collection !== 'heroes') return next();
  //TODO: validate 'category' field is 'hero' or 'villain'
  var superDoc = new Super(req.body.model);
  superDoc.category = pluralize(collection, 1);
  superDoc.save(function (err) {
    if (err) return errors.error500(res, 'save '+superDoc.category, err.errors);
    
    res.send({ data: superDoc.publicSuper() });
  });
});

// #read
router.get('/:collection/:id', function (req, res, next) {
  if (!errors.isHex24(req.params.id)) {
    return errors.error400(res);
  }

  var collection = req.params.collection;
  if (collection !== 'villains' && collection !== 'heroes') return next();

  var id = mongoose.Types.ObjectId(req.params.id);
  Super
    .findOne({ 
      _id: id, 
      category: pluralize(collection, 1)
    }, '-category -__v') 
    .populate('crises')
    .exec(function (err, superDoc) {
      if (err) return next(err);
      if (!superDoc) return errors.error404(res, id);

      superDoc.crises = superDoc.crises.map(function (c) {
        return c.publicCrisis();
      });

      res.send({ data: superDoc });
    });
});

// #update
router.put('/:collection/:id', function(req, res, next) {
  if (!errors.isHex24(req.params.id)) {
    return errors.error400(res);
  }

  var collection = req.params.collection;
  if (collection !== 'villains' && collection !== 'heroes') return next();

  var id = mongoose.Types.ObjectId(req.params.id);
  Super
    .findOne({ 
      _id: id,
      category: pluralize(collection, 1)
    })
    .exec(function (err, superDoc) {
      if (err) return next(err);
      if (!superDoc) return errors.error404(res, id);

      for (var prop in req.body.model) 
        superDoc[prop] = req.body.model[prop];

      superDoc.save(function (err) {
        if (err) return errors.error500(res, 'update '+superDoc.category, err.errors);
        
        res.send({ data: superDoc.publicSuper() });
      });
    });
});

// #delete
router.delete('/:collection/:id', function(req, res) {
  if (!errors.isHex24(req.params.id)) {
    return errors.error400(res);
  }

  var collection = req.params.collection;
  if (collection !== 'villains' && collection !== 'heroes') return next();

  var id = mongoose.Types.ObjectId(req.params.id);
  Super
    .findOne({ 
      _id: id,
      category: pluralize(collection, 1)
    })
    .exec(function (err, superDoc) {
      if (err) return next(err);
      if (!superDoc) return errors.error404(res, id);
      
      var supersSet;
      if (superDoc.category === 'villain') {
        supersSet = { villains: superDoc._id }
      } else if (superDoc.category === 'hero') {
        supersSet = { heroes: superDoc._id }
      }

      superDoc.remove(function (err) {
        if (err) return next(err);

        Crisis.update({
          _id: { $in: superDoc.crises } 
        }, {
          $pull: supersSet
        }, { 
          multi: true 
        }, function (err) {
          if (err) return next(err);

          if (superDoc.category === 'villain') {
            Crisis.update({ 
              _id: { $in: superDoc.crises }, 
              villains: { $size: 0 } 
            }, {
              $currentDate: { end: true }
            }, {
              multi: true
            }, function (err) {
              if (err) console.log(err);
            });
          }

          res.send({ data: superDoc.publicSuper() }); 
        });
      });
    });
});

module.exports = router;
