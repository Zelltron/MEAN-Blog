var express = require('express'),
    sassMiddleware = require('node-sass-middleware'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    uristring = process.env.MONGOLAB_URI || 'mongodb://localhost/news',
    theport = process.env.PORT || 3000;

mongoose.connect(uristring, function (err, res) {
   if (err) {
   console.log ('ERROR connecting to: ' + uristring + '. ' + err);
   } else {
   console.log ('Succeeded connected to: ' + uristring);
   }
 });

require('./models/Comments');
require('./models/Posts');
require('./models/Users');
require('./config/passport');

var routes = require('./routes/index'),
    users = require('./routes/users'),
    app = express();

var srcPath = __dirname + '/sass';
var destPath = __dirname + '/public/stylesheets';


module.exports = app;

// view engine setup
app.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: false }))
.use(cookieParser())
.use(
  sassMiddleware({
    /* Options */
    src: srcPath,
    dest: destPath,
    debug: true,
    outputStyle: 'expanded',
    prefix: '/styles'
  })
)
.use(express.static(path.join(__dirname, 'public')))
.use(passport.initialize())
//web routes
.use('/', routes)
.use('/users', users)
// catch 404 and forward to error handler
.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
