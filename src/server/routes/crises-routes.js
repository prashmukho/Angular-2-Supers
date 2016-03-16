var mongoose = require('mongoose');
var schemaModule = require('../db/init');
var Crisis = schemaModule.Crisis;
var Super = schemaModule.Super;

var express = require('express');
var router = express.Router();

// #index
router.get('/crises', function(req, res) {
  var collection = req.params.collection;
  Crisis
    .find(function (err, crises) {
      if (err) console.log(err);
      res.send({ data: crises });
    });
});

// Creating a Crisis doc via a villain and adding it to 
// the villain's crises array as a ref
router.post('/villains/:villainId/crises', function(req, res) {
  var villainId = mongoose.Types.ObjectId(req.params.villainId);
  Super
    .findById(villainId, function (err, villain) {
      if (err) console.log(err);
      
      var crisis = new Crisis(req.body.crisis);
      crisis.villains.push(villain);
      crisis.save(function (err) {
        if (err) console.log(err);

        res.send({ data: crisis });
      });
    });
});

// Adding a Crisis doc to a hero's crises array as a ref
// router.post('/heroes/:id/crises', function(req, res) {
//   var heroId = mongoose.Types.ObjectId(req.params.id);
// });

// #read
// router.get('/crises/:id', function(req, res) {
//   var id = mongoose.Types.ObjectId(req.params.id);
//   Crisis
//     .findById(id, function (err, crisis) {
//       if (err) console.log(err);
//       res.send({ data: crisis });
//     });
// });

module.exports = router;
