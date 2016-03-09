var villainsRoutes = require('./routes/villains-routes');
var keyRoutes = require('./routes/key-routes');

module.exports = function routes(app) {
  app.use('/api/v1', villainsRoutes);
  // app.use('/env', keyRoutes);
};