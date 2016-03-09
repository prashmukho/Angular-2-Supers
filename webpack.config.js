var path = require('path');
var webpack = require('webpack');

var ENV = process.env.ENV = process.env.NODE_ENV = 'development';
var metadata = {
  title: 'My Angular2 App with Webpack',
  baseUrl: '/',
  host: 'localhost',
  port: 8080,
  ENV: ENV
};
// for inline autorefresh of page with NodeJS API
var devServerEntry = [
  'webpack-dev-server/client?http://' + metadata.host + ':' + metadata.port + '/',
  'webpack/hot/only-dev-server'
];

// CONFIG:
module.exports = {
  // static data for index.html
  metadata: metadata,
  // for faster builds use 'eval'
  devtool: 'source-map',
  debug: true,
  // cache: false,

  // angular app bundles
  entry: { 
    'polyfills': devServerEntry.concat(['./src/polyfills.ts']),
    'main': devServerEntry.concat(['bootstrap-loader', './src/main.ts'])
  },

  // build files
  output: {
    path: root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    // ensure loader extensions match
    // ensure .async.ts etc also works
    // prepend adds '' too
    extensions: prepend(['.ts','.js','.json','.scss','.html'], '.async')
  },

  module: {
    preLoaders: [
      // `exclude: [ root('node_modules/rxjs') ]` to prevent
      //    WARNING in ./~/rxjs/...
      //    Cannot find source file '...': Error: Cannot resolve 'file' or 'directory'
      { test: /\.js$/, loader: "source-map-loader", exclude: [ root('node_modules/rxjs') ] }
    ],
    loaders: [
      // Support Angular 2 async routes via .async.ts
      { 
        test: /\.async\.ts$/, 
        loaders: ['es6-promise-loader', 'ts-loader'], 
        exclude: [ /\.(spec|e2e)\.ts$/ ] 
      },

      // Support for .ts files.
      { 
        test: /\.ts$/, loader: 'ts-loader', 
        exclude: [ /\.(spec|e2e|async)\.ts$/ ] 
      },

      // Support for *.json files.
      { test: /\.json$/,  loader: 'json-loader' },

      // support for .html as raw text
      { test: /\.html$/,  loader: 'raw-loader', exclude: [ root('dist/index.html') ] },
      
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loader: 'url?limit=10000'
      },

      {             
        test: /\.scss$/,
        loaders: [
            'style-loader',
            'css-loader',
            'autoprefixer-loader?browsers=last 3 versions',
            'sass-loader?outputStyle=expanded'
        ]
      },

      {
        test: /bootstrap-sass\/assets\/javascripts\//,
        loader: 'imports?jQuery=jquery'
      }

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

    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(metadata.ENV),
        'NODE_ENV': JSON.stringify(metadata.ENV)
      }
    }),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    
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

// HELPERS
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

