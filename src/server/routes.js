var crisesRoutes = require('./routes/crises-routes');
var supersRoutes = require('./routes/supers-routes');

module.exports = function routes(app) {
  app.use('/api/v1', crisesRoutes);
  app.use('/api/v1', supersRoutes);
};