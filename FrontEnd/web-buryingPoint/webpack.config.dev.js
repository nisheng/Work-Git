const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");

const eslintOptions = {
  context: path.resolve(__dirname, "./src"),
  exclude: "node_modules",
  fix: true,
};

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    clean: true,
    filename: 'bTag_[fullhash].js',
    library: {
      name: 'Report',
      type: 'umd',
      export: 'default'
    },
  },
  plugins: [new ESLintPlugin(eslintOptions), new HtmlWebpackPlugin({
    template: '/public/index.html'
  })],
  // experiments: {
  //   topLevelAwait: true
  // },
  performance: {
    hints: false,
  },
  devServer: {
    static: {
      // directory: false,
      directory: path.join(__dirname, "public"),
    },
    proxy: {
      '/api': 'http://192.168.102.168:9057',
      // '/api': 'http://mol.sit.emarineonline.com'
    },
    compress: true,
    port: 9000,
    open: true,
    hot: true,
  },
};
