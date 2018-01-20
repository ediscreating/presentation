const webpack = require('webpack');
const config = require('./webpack.config.js');

function handleWebpackError(err) {
  console.error(err.stack || err);

  if (err.details) {
    console.error(err.details);
  }
}

function handleCompilation(stats) {
  const info = stats.toJson("minimal");

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  console.log(stats.toString({
    colors: true
  }));
}

module.exports = function(callback) {
  webpack(config, (err, stats) => {
    if (err) {
      handleWebpackError(err);
    } else {
      handleCompilation(stats);
    }

    callback();
  });
};
