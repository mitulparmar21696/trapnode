var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mailer = require('express-mailer');
var session = require('express-session');
var flash = require('connect-flash');
var cron = require('node-cron');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/trupr', {useMongoClient: true})
//mongoose.connect('mongodb://root:root@127.0.0.1:27017/happymeter-dev1?authSource=admin', { useMongoClient: true })
        .then(() => {
            console.log(`Succesfully Connected to the Mongodb Database at URL : mongodb://127.0.0.1:27017/trupr`);
        })
        .catch(() => {
            console.log(`Error Connecting to the Mongodb Database at URL : mongodb://127.0.0.1:27017/trupr`);
        });

//modules
var handleBarHelpers = require('./modules/handlebar.helper');
var constants = require('./modules/constants');

// Get the API routes.
var apiRoutes = require('./routes/api.routes');

var app = express();

app.use(session({
    secret: '53fYuRzabXfpvoJPheHJYuzZMDXOb05G',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false,
        maxAge: 31536000000
    }
}));

app.use(flash());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
// mailer configuration
mailer.extend(app, {
    from: constants.MAIL_FROM,
    host: constants.MAIL_HOST, // hostname 
    secureConnection: constants.MAIL_SECURE, // use SSL 
    port: constants.MAIL_PORT, // port for secure SMTP 
    transportMethod: constants.MAIL_METHOD, // default is SMTP. Accepts anything that nodemailer accepts 
    auth: {
        user: constants.MAIL_FROM_AUTH,
        pass: constants.MAIL_PASSWORD
    }
});

// view engine setup
app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    helpers: handleBarHelpers.helperFunction,
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: [
        __dirname + '/views/partials',
    ]
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, './views'));

// use other modules
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set headers
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// admin routes
// API routes
app.use('/api', apiRoutes);

// Catch all other routes and return the index file.
app.use(express.static(path.join(__dirname, '../dist')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {layout: false});
});

module.exports = app;