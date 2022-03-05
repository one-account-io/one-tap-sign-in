const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  entry: './index.js',
  output: {
    filename: 'min.js',
    library: 'OneAccountOneTapSignIn',
  },
  mode: 'production',
  resolve: {
    fallback: {
      buffer: require.resolve('buffer'),
    },
  },
};
