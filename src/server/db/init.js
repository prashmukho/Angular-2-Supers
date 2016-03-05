var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/villains');

module.exports.Villain = mongoose.model('Villain', {
  name: { type: String, required: true },
  power: { type: String, required: true },
  alias: String
});