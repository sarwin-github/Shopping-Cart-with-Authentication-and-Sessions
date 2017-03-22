var express = require('express')
,	mongoose = require('mongoose')
,	passport = require('passport')
, 	flash = require('connect-flash')
,	morgan = require('morgan')
,	cookieParser = require('cookie-parser')
,	bodyParser = require('body-parser')
, 	session = require('express-session')
,	http = require('http')
,	app = express();

var mongoConnectionLocal  = 'mongodb://localhost:27017/authentication-session';
mongoose.Promise = global.Promise;
mongoose.connect(mongoConnectionLocal, (error, database) => { if(error) { console.log(error); }});

app.set('port', process.env.PORT || 8008);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.set('view engine', 'ejs');

app.use(session({
		secret: "secret session key: A235fsdASge33yH3tu",    
		resave: true,
	    saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var passportAuth = require('./config/passport')(passport);
var routes = require('./app/routes/routes.js')(app, passport);


http.createServer(app).listen(app.get('port'), () => {
	console.log('Server Listening to port: ' + app.get('port'));
});

