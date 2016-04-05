var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var superSchema = new Schema({
  category: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  power: { type: Schema.Types.Mixed, required: true },
  alias: String,
  crises : [{ type: Schema.Types.ObjectId, ref: 'Crisis' }]
});

superSchema.methods.publicSuper = function () {
  return {
    _id: this._id,
    name: this.name,
    power: this.power,
    alias: this.alias
  };
};

var crisisSchema = new Schema({
  title : { 
    type: String, 
    required: [true, 'Title is required'], 
    trim: true 
  },
  //TODO: use timestamps which add 'createdAt' and 'updatedAt' fields
  begin: { 
    type: Date, 
    default: Date.now 
  },
  end: Date,
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
    }
  }
});

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
    epicenter: this.epicenter
  };
};

module.exports = {
  Super: mongoose.model('Super', superSchema),
  Crisis: mongoose.model('Crisis', crisisSchema)
}

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/villains');