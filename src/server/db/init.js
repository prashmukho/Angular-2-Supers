var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ValidationError = mongoose.Error.ValidationError;
var ValidatorError  = mongoose.Error.ValidatorError;

var superSchema = new Schema({
  category: { 
    type: String, 
    required: [true, "A `category` is required!"], 
    enum: ['villain', 'hero'],
    index: true 
  },
  name: { 
    type: String, 
    required: [true, "A `name` is required!"]
  },
  power: { 
    type: {
      name: { type: String }, 
      strength: { type: Number } 
    }, 
    required: [true, "A `power` is required!"]
  },
  alias: String,
  crises : [{ type: Schema.Types.ObjectId, ref: 'Crisis' }]
});

superSchema.pre('save', function (next) {
  var error = myPowerValidation(this);
  if (Object.keys(error.errors).length)
    next(error);
  else {
    this.power.strength = Math.round(Number(this.power.strength));
    next();
  }
});

function myPowerValidation(target) {
  var error = new ValidationError(target);
  if (target.power) {
    if (!target.power.name)
      error.errors.powerName = new ValidatorError({
        path: 'power.name', 
        message: 'Power `name` is required', 
        type: 'required'
      });

    if (!target.power.strength)
      error.errors.powerStrength = new ValidatorError({
        path: 'power.strength', 
        message: 'Power `strength` is required', 
        type: 'required'
      });
    else if (Number(target.power.strength) < 0 || Number(target.power.strength) > 5)
      error.errors.powerStrength = new ValidatorError({
        path: 'power.strength', 
        message: 'Power `strength` must be in [0, 5]', 
        type: 'notvalid'
      });
  }
    
  return error;
}

superSchema.methods.publicSuper = function () {
  return {
    _id: this._id,
    name: this.name,
    power: this.power,
    alias: this.alias,
    crises: undefined
  };
};

var crisisSchema = new Schema({
  title : { 
    type: String, 
    required: [true, "A `title` is required!"]
  },
  begin: { 
    type: Date, 
    default: Date.now
    // validate: {
    //   validator: function (date) {
    //     return date.getTime() >= Date.now();
    //   },
    //   message: "Crisis `begin` cannot precede the present!"
    // }
  },
  end: { 
    type: Date, 
    // default: Date.now,
    // validate: {
    //   validator: function (date) {
    //     return date.getTime() >= Date.now();
    //   },
    //   message: "Crisis `end` cannot precede the present!"
    // }
  },
  villains : [{ type: Schema.Types.ObjectId, ref: 'Super' }],
  heroes: [{ type: Schema.Types.ObjectId, ref: 'Super' }],
  // Point geoJSON object
  epicenter: { 
    type: [Number], 
    index: '2dsphere',
    // default: [77.1662735, 28.561450999999998],
    validate: {
      validator: isPoint,
      message: '[{VALUE}] is not a valid point coordinate!'
    },
    required: [true, "An `epicenter` is required!"]
  }
});
crisisSchema.index({ villains: 1 });
crisisSchema.index({ heroes: 1 });

function isPoint(coords) {
  return toString.call(coords).match(/\s(\w+)\]$/)[1] === 'Array' &&
         coords.every(function (n) { return typeof n === 'number' }) &&
         coords.length === 2;
}

crisisSchema.methods.publicCrisis = function () {
  return {
    _id: this._id,
    title: this.title,
    begin: this.begin,
    end: this.end,
    epicenter: this.epicenter,
    danger: 0,
    villains: undefined,
    heroes: undefined
  };
};

module.exports = {
  Super: mongoose.model('Super', superSchema),
  Crisis: mongoose.model('Crisis', crisisSchema)
}

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/villains');

