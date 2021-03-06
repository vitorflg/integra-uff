const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const RemarkHTML = require('remark-html');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './dist/index.html',
});

const MiniCssExtractPluginConfig = new MiniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[id].css',
});

const CompressionPluginConfig = new CompressionPlugin();

const PreloadWebpackPluginConfig = new PreloadWebpackPlugin({
  rel: 'preload',
  as: 'font',
  include: 'allAssets',
  fileWhitelist: [/\.(woff2?|eot|ttf|otf)(\?.*)?$/i],
});

const CopyWebpackPluginConfig = new CopyPlugin({
  patterns: [
    { from: './src/assets/fonts/roboto.woff2', to: './' },
    { from: './src/assets/fonts/roboto-light.woff2', to: './' },
    { from: './dist/favicon.ico', to: './' },
  ],
});

module.exports = {
  entry: './src/App.tsx',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
      },

      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff2|ttf|woff|ico)$/,
        use: ['file-loader?name=[name].[ext]'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ['url-loader?limit=10000', 'img-loader'],
      },
    ],
  },
  devServer: {
    hot: true,
    liveReload: true,
    historyApiFallback: true,
  },
  resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  output: {
    filename: 'bundle.js',
  },
  watchOptions: {},
  plugins: [
    // new BundleAnalyzerPlugin(),
    MiniCssExtractPluginConfig,
    HTMLWebpackPluginConfig,
    PreloadWebpackPluginConfig,
    CompressionPluginConfig,
    CopyWebpackPluginConfig,
    new webpack.HotModuleReplacementPlugin(),
  ],
  parallelism: 10,
};
