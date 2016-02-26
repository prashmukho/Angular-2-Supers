// @AngularClass

/*
 * Helper: root(), and rootDir() are defined at the bottom
 */
var path = require('path');
var webpack = require('webpack');
// var CopyWebpackPlugin  = require('copy-webpack-plugin');
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var ENV = process.env.ENV = process.env.NODE_ENV = 'development';

var metadata = {
  title: 'My Angular2 App with Webpack',
  baseUrl: '/',
  host: 'localhost',
  port: 8080,
  ENV: ENV
};
/*
 * Config
 */
module.exports = {
  // static data for index.html
  metadata: metadata,
  // for faster builds use 'eval'
  devtool: 'source-map',
  debug: true,
  // cache: false,

  // our angular app
  entry: { 
    'polyfills': [
      'webpack-dev-server/client?http://127.0.0.1:8080/',
      'webpack/hot/only-dev-server',
      './src/polyfills.ts'
    ],
    'main': [
      'webpack-dev-server/client?http://127.0.0.1:8080/',
      'webpack/hot/only-dev-server',
      './src/main.ts'
    ] 
  },

  // Config for our build files
  output: {
    path: root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    // ensure loader extensions match
    extensions: prepend(['.ts','.js','.json','.css','.html'], '.async') // ensure .async.ts etc also works
  },

  module: {
    preLoaders: [
      // { test: /\.ts$/, loader: 'tslint-loader', exclude: [ root('node_modules') ] },
      // TODO(gdi2290): `exclude: [ root('node_modules/rxjs') ]` fixed with rxjs 5 beta.2 release
      { test: /\.js$/, loader: "source-map-loader", exclude: [ root('node_modules/rxjs') ] }
    ],
    loaders: [
      // Support Angular 2 async routes via .async.ts
      { test: /\.async\.ts$/, loaders: ['es6-promise-loader', 'ts-loader'], exclude: [ /\.(spec|e2e)\.ts$/ ] },

      // Support for .ts files.
      { test: /\.ts$/, loader: 'ts-loader', exclude: [ /\.(spec|e2e|async)\.ts$/ ] },

      // Support for *.json files.
      { test: /\.json$/,  loader: 'json-loader' },

      // Support for CSS as raw text
      { test: /\.css$/,   loader: 'raw-loader' },

      // support for .html as raw text
      { test: /\.html$/,  loader: 'raw-loader', exclude: [ root('dist/index.html') ] }

      // if you add a loader include the resolve file extension above
    ]
  },

  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(true),
    // new webpack.optimize.CommonsChunkPlugin({ 
    //   name: 'polyfills', 
    //   filename: 'polyfills.bundle.js', 
    //   minChunks: Infinity 
    // }),
    // static assets
    // new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' } ]),
    // generating html
    // new HtmlWebpackPlugin({ template: 'dist/index.html' }),
    // replace
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     'ENV': JSON.stringify(metadata.ENV),
    //     'NODE_ENV': JSON.stringify(metadata.ENV)
    //   }
    // })
    
    // inline hot module reload with NodeJS API
    new webpack.HotModuleReplacementPlugin(),
    // used with webpack/hot/only-dev-server entry point for autorefresh
    new webpack.NoErrorsPlugin() 
  ],

  // Other module loader config
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  },
  // our Webpack Development Server config
  devServer: {
    // port: metadata.port,
    // host: metadata.host,
    // historyApiFallback: true,
    // watchOptions: { aggregateTimeout: 300, poll: 1000 },

    // inline hot module reload with NodeJS API
    hot: true,
    proxy: { '*': 'http://localhost:3000' }
  },
  // we need this due to problems with es6-shim
  node: {
    global: 'window', 
    progress: false, 
    crypto: 'empty', 
    module: false, 
    clearImmediate: false, 
    setImmediate: false
  }
};

// Helper functions

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function prepend(extensions, args) {
  args = args || [];
  if (!Array.isArray(args)) { args = [args] }
  return extensions.reduce(function(memo, val) {
    return memo.concat(val, args.map(function(prefix) {
      return prefix + val
    }));
  }, ['']);
}
function rootNode(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}
