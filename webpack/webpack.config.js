const merge = require('webpack-merge');
const base = require("./webpack.base.config");

const config = {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    proxy: {
      '/rest': 'http://192.168.49.65:9999/'
    }
  }
};

module.exports = merge(base, config);
