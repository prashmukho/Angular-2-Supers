var mongoose = require('mongoose');
var Super = require('../db/init').Super;
var Crisis = require('../db/init').Crisis;

var express = require('express');
var router = express.Router();
var pluralize = require('pluralize');

// :collection refers to a category-based collection for making 
// REST-like requests to a single real collection of supers
// eg. /heroes/... for handling { category: 'heroes' } and so on.

// #index
router.get('/:collection', function(req, res) {
  var collection = req.params.collection;
  Super
    .find({ 
      category: pluralize(collection, 1)
    }, '-category -crises', function (err, villains) {
      if (err) console.log(err);
      res.send({ data: villains });
    });
});

// #create
router.post('/:collection', function(req, res) {
  var model = new Super(req.body.model), 
      collection = req.params.collection;
  //TODO: validate 'category' field is 'hero' or 'villain'
  model.category = pluralize(collection, 1);
  model.save(function (err) {
    if (err) console.log(err);
    res.send({ data: model.publicSuper() });
  });
});

// #read
router.get('/:collection/:id', function(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  Super
    .findById(id, '-category -crises', function (err, model) {
      if (err) console.log(err);
      res.send({ data: model });
    });
});

// #update
router.put('/:collection/:id', function(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  Super
    .findByIdAndUpdate(id, { 
      $set: req.body.model 
    }, {
      new: true, // return updated object
      runValidators: true, 
      select: '-category -crises'
    }, function (err, model) {
      if (err) console.log(err);
      res.send({ data: model });
    });
});

// #delete
router.delete('/:collection/:id', function(req, res) {
  var id = mongoose.Types.ObjectId(req.params.id);
  Super
    .findById(id, function (err, model) {
      if (err) console.log(err);
      
      var supersSet;
      if (model.category === 'villain') {
        supersSet = { villains: model._id }
      } else if (model.category === 'hero') {
        supersSet = { heroes: model._id }
      }

      model.remove(function (err) {
        if (err) console.log(err);

        Crisis.update({
          _id: { $in: model.crises } 
        }, {
          $pull: supersSet
        }, { 
          multi: true 
        }, function (err) {
          if (err) console.log(err);

          if (model.category === 'villain') {
            Crisis.update({ 
              _id: { $in: model.crises }, 
              villains: { $size: 0 } 
            }, {
              $currentDate: { end: true }
            }, {
              multi: true
            }, function (err) {
              if (err) console.log(err);
            });
          } 
          
          res.send({ data: model.publicSuper() }); 
        });
      });
    });
});

module.exports = router;
