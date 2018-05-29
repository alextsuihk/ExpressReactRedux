const { resolve } = require('path');

const autoprefixer = require('autoprefixer');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const postcssFlexBugsFixes = require('postcss-flexbugs-fixes');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const webpack = require('webpack');

const hashKey = Date.now().toString(16).slice(-11, -3);

const cssOutputLocation = process.env.NODE_ENV === 'production' ?
  `public/stylesheets/style.${hashKey}.css` :
  'stylesheets/style.css';

const jsProdOutput = {
  filename: `public/javascripts/build.${hashKey}.js`,
  //filename: 'public/javascripts/build-prod.js',
  path: resolve(__dirname),
  publicPath: '/',
};

const jsDevOutput = {
  filename: 'javascripts/build.js',
  path: '/',
  publicPath: '/',
};

const jsOutputLocation = process.env.NODE_ENV === 'production' ? jsProdOutput : jsDevOutput;

const browserlist = [
  '>1%',
  'last 4 versions',
  'Firefox ESR',
  'android >= 4.4',
  'edge >= 16',
  'ios >= 8',
  'not ie < 9', // React doesn't support IE8 anyway
];

module.exports = {
  context: resolve(__dirname, 'src'), // define base dir, compile everthing in src
  entry: [
    'babel-polyfill', // manually require for browser compatibility
    './index.jsx',    // start from index.jsx
  ],
  output: jsOutputLocation,
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules|bower_components|public\/)/,
        loader: 'babel-loader',
        options: {
          presets: ['react',
            ['env', {
              targets: {
                browsers: browserlist,
              },
              modules: false,
              useBuiltIns: true,
              debug: false,
            }],
            'stage-2',
          ],
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      // The notation here is somewhat confusing.
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader normally turns CSS into JS modules injecting <style>,
      // but unlike in development configuration, we do something different.
      // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
      // (second argument), then grabs the result CSS and puts it into a
      // separate file in our build process. This way we actually ship
      // a single CSS file in production instead of JS code injecting <style>
      // tags. If you use code splitting, however, any async bundles will still
      // use the "style" loader inside the async code so CSS from them won't be
      // in the main CSS file.
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',   // translates CSS into CommonJS
              options: {
                importLoaders: 1,
                minimize: true,       // minify development verion as well !
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebookincubator/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                  postcssFlexBugsFixes,
                  autoprefixer({
                    browsers: browserlist,
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',  // compiles Sass to CSS
            },
          ],
          fallback: {                 // creates style nodes from JS strings
            loader: 'style-loader',
            options: { hmr: false },
          },
        }),
      },
    ],
  },
  plugins: [      // update react bundle without rebuilding every time
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin(cssOutputLocation),
  ],
};

if (process.env.NODE_ENV === 'production') {
  module.exports.optimization = { minimize: true };
  module.exports.mode = 'production';
  module.exports.plugins.push(new webpack.HashedModuleIdsPlugin());
  module.exports.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
  module.exports.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }));
  module.exports.plugins.push(new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
    threshold: 10240,
    minRatio: 0.8,
    deleteOriginalAssets: true,
  }));

  // Generate a manifest file which contains a mapping of all asset filenames
  // to their corresponding output file so that tools can pick it up without
  // having to parse `index.html`.
  module.exports.plugins.push(new ManifestPlugin({
    fileName: 'build/asset-manifest.json',
  }));

  // Generate a service worker script that will precache, and keep up to date,
  // the HTML & assets that are part of the Webpack build.
  module.exports.plugins.push(new SWPrecacheWebpackPlugin({
    // By default, a cache-busting query parameter is appended to requests
    // used to populate the caches, to ensure the responses are fresh.
    // If a URL is already hashed by Webpack, then there is no concern
    // about it being stale, and the cache-busting can be skipped.
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    filename: 'public/service-worker.js',
    logger(message) {
      if (message.indexOf('Total precache size is') === 0) {
        // This message occurs for every build and is a bit too noisy.
        return;
      }
      if (message.indexOf('Skipping static resource') === 0) {
        // This message obscures real errors so we ignore it.
        // https://github.com/facebookincubator/create-react-app/issues/2612
        return;
      }
      console.log(message);
    },
    minify: true,
    // For unknown URLs, fallback to the index page
    //navigateFallback: `${appConfig.app.externalUrl}:${appConfig.app.port}`,
    navigateFallback: 'http://localhost:3000',
    // Ignores URLs starting from /__ (useful for Firebase):
    // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
    navigateFallbackWhitelist: [/^(?!\/__).*/],
    // Don't precache sourcemaps (they're large) and build asset manifest:
    staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
  }));
}

if (process.env.NODE_ENV !== 'production') {
  module.exports.mode = 'development';
  module.exports.entry.unshift(   // add the following at the BEGINNING of entry
    'react-hot-loader/patch',     // enable hot loader for react
    'react-hot-loader/babel',
    'webpack-hot-middleware/client',
  );
  module.exports.plugins.unshift(new webpack.HotModuleReplacementPlugin());
}
