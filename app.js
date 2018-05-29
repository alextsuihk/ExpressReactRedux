const appConfig = require('./config.js');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const express = require('express');
const expressSession = require('express-session');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const RateLimit = require('express-rate-limit');
const redis = require('redis');
const RedisStore = require('connect-redis')(expressSession);
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const User = require('./models/user');

// Route Files
const api = require('./routes/api/index');
const authentication = require('./routes/api/authentication');
const datasheets = require('./routes/api/datasheet/memory');
const inventory = require('./routes/api/inventory/memory');
const index = require('./routes/index');
const users = require('./routes/api/users');

const app = express();

// connect to mongoose
let mongodbUrl;
const {
  authEnabled, username, password, host, mongodb,
} = appConfig.database.mongo;

if (authEnabled) {
  mongodbUrl = `mongodb://${username}:${password}@${host}/${mongodb}?authSource=admin`;
} else {
  mongodbUrl = `mongodb://${host}/${mongodb}`;
}

mongoose.connect(mongodbUrl, (error) => {
  if (error) {
    console.log('Fail connecting to Mongo DB'); // eslint-disable-line
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Enable Compression for non *.gz file
app.use(compression({ filter: shouldCompress }));
function shouldCompress(req, res) {
  if (req.originalUrl.endsWith('js.gz')) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    return false;
  }
  if (req.originalUrl.endsWith('css.gz')) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    return false;
  }
  return true;
}

// Cookie Parser
app.use(cookieParser());

// Express Session
const client = redis.createClient({
  host: appConfig.database.redis.host,
  port: appConfig.database.redis.port,
  disableTTL: true,
  logErrors: true,        //AT: Debug ONLY
});

const sessionOptions = {
  cookie: {
    maxAge: 60 * 60 * 24 * 3,
    secure: app.get('env') === 'production',
  },
  name: 'sessionId',
  resave: false,
  saveUninitialized: true,
  secret: appConfig.expressSession.secret,
  store: new RedisStore({ client }),
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
}

app.use(expressSession(sessionOptions));

// Helmet & Security: Adjust headers for security
app.use(helmet());
app.disable('x-powered-by');    // security: don't want user to konw we are using Express

// Passport section
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// public folder
app.use(express.static(path.join(__dirname, 'public')));

// Webpack server
if (process.env.NODE_ENV !== 'production') {
  const webpackCompiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: true,
      'errors-only': true,
    },
  }));
  app.use(webpackHotMiddleware(webpackCompiler, {
    log: console.log,     // eslint-disable-line
  }));
}

// configure rate limiter
const limiter = new RateLimit({
  windowMs: 1 * 60 * 1000, // 5 minutes
  delayAfter: 50, // begin slowing down responses after the first 50 request
  delayMs: 3 * 1000, // slow down subsequent responses by 3 seconds per request
  max: 500, // start blocking after 5 requests
  message: 'Server is too busy, please try again after 5mins',
});

//  apply to all requests
app.use('/', limiter);

app.use('/api', api);
app.use('/api/authentication', authentication);
app.use('/api/inventory', inventory);
//app.use('/app/datasheet', datasheet);
app.use('/api/users', users);

app.use('/*', index);   // anything else, will route to react; react will take care of 404

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
