const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");


module.exports = {
  mode: 'development',
  entry: './src/client/c_index.js',
  devtool: 'source-map',
  output: {
    clean: true, // Clean the output directory before emit. no need for clean-webpack-plugin
  },
  module:{
    rules: [
      {
        test: /\.css$/i,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ]
  },
  plugins:[
    new HtmlWebPackPlugin({
      template: "./src/client/views/index.html",
      filename:"index.html",
    })
  ]
}  