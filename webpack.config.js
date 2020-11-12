const path = require('path');
let CopyWebpackPlugin  = require('copy-webpack-plugin');

module.exports = {
  entry: './demo.ts',
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    watchContentBase: true,
    port: 9000,
    hot: false,
    inline: true,
    open: true,
    watchOptions: {
      ignored: '/node_modules'
    }
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/overlays/**/*.html',
          to: 'overlays',
        }
      ],
    }),
  ]
};