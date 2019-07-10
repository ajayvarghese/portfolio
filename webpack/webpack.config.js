const merge = require('webpack-merge');
const base = require("./webpack.base.config");

const config = {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    proxy: {
      '/rest': 'http://192.168.49.65:9999/',
      '/mail': {
        target: 'http://35.239.209.158:3000',
        pathRewrite: {'^/mail' : ''}
      }
    }
  }
};

module.exports = merge(base, config);
