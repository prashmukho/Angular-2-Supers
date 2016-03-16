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
  title : { type: String, required: true, trim: true },
  begin: { type: Date, default: Date.now },
  end: Date,
  villains : [{ type: Schema.Types.ObjectId, ref: 'Super' }],
  heroes: [{ type: Schema.Types.ObjectId, ref: 'Super' }]
});


module.exports = {
  Super: mongoose.model('Super', superSchema),
  Crisis: mongoose.model('Crisis', crisisSchema)
}

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/villains');