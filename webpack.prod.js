const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './src/client/c_index.js',
  devtool: 'source-map',
  optimization: {
    minimizer: [new TerserPlugin({}), new CssMinimizerPlugin({})],
  },
  output: {
    clean: true, // Clean the output directory before emit. no need for clean-webpack-plugin
  },
  module:{
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
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
    }),
    new MiniCssExtractPlugin({ filename: '[name].css' })
  ]
}