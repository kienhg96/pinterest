var express = require('express');
var app = express();
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var index = require('./routes/index');
var initPassport = require('./authenticate/init-passport');
dotenv.load();

// Configuring view
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// Configuring app
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({secret: 'MYSecRetKey', resave: true, saveUninitialized: true}));
app.use(cookieParser());
app.use(bodyParser.json());

// Configuring passport
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

// Configuring Router
app.use(express.static(__dirname + '/public'));
app.use('/', index(passport));


var port = process.env.PORT || 8080;
app.listen(port, function(err){
    if (err) throw err;
    console.log('Server is listening on port ' + port);
});