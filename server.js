var express = require('express')
,	mongoose = require('mongoose')
,	passport = require('passport')
, 	flash = require('connect-flash')
,	morgan = require('morgan')
,	cookieParser = require('cookie-parser')
,	bodyParser = require('body-parser')
, session = require('express-session')
,	http = require('http')
//,	mongoStore = require('connect-mongo')(session)
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
app.set('views', __dirname + '/views');

app.use(session({
		secret: "secret session key: A235fsdASge33yH3tu",    
		resave: false,
	  saveUninitialized: false, 
		//store: new mongoStore({ mongooseConnection: mongoose.connection }),
		//cookie: { maxAge: 60 * 60 * 1000}
	}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated(); //variable available in all views ('login' is the name of the variable)
  //res.locals.session = req.session;
  next();
});
 
require('./config/passport')(passport);
require('./app/routes/routes')(app, passport);
require('./app/routes/product-auth')(app, passport);
var productRoutes = require('./app/routes/product');

app.use('/', productRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.createServer(app).listen(app.get('port'), () => {
	console.log('Server Listening to port: ' + app.get('port'));
});

