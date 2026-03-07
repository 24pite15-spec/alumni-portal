module.exports = app => {
  app.use('/api/brand', require('../api/master/brand'));
};
