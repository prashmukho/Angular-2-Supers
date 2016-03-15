var supersRoutes = require('./routes/supers-routes');

module.exports = function routes(app) {
  app.use('/api/v1', supersRoutes);
};