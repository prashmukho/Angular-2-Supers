var mongoose = require('mongoose');
var Super = require('../db/init').Super;

var express = require('express');
var router = express.Router();
var pluralize = require('pluralize');

// :collection refers to a category-based collection for making 
// REST-like requests to a single real collection of supers
// eg. /heroes/... for handling { category: heroes } and so on

// #index
router.get('/:collection', function(req, res) {
  var collection = req.params.collection;
  Super
    .find({ 
      category: pluralize(collection, 1)
    }, '-category -crises', 
    function (err, villains) {
      if (err) console.log(err);
      res.send({ data: villains });
    });
});

// #create
router.post('/:collection', function(req, res) {
  var model = new Super(req.body.model);
  model.category = pluralize(req.params.collection, 1);
  model.save(function (err) {
    if (err) console.log(err);
    res.send({ 
      // not sending fields - category, crises
      data: model.publicSuper()
    });
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
    .findByIdAndRemove(id, {
      select: '-category -crises'
    }, function (err, model) {
      if (err) console.log(err);
      res.send({ data: model });
    });
});

module.exports = router;
