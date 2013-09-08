var config = {
  filename: __filename,
  styles: ['./behaviors'],
  scripts: {
    behaviors: require('./behaviors')
  }
};

module.exports = function(app, options) {
  app.createLibrary(config, options);
};
