const {resolve, join} = require('path');

module.exports = {
  mode: 'development',
  entry: {
    'example/app': './src/example.ts',
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname)
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.js$/, use: ["source-map-loader"], enforce: "pre" }
    ]
  },
  devServer: {
    contentBase: join(__dirname, 'example'),
  },
  devtool: 'source-map'
}
