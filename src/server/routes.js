var villainsRoutes = require('server/routes/villains-routes');

module.exports = function routes(app) {
  app.use('/api/v1', villainsRoutes);
};