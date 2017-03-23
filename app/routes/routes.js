module.exports = function (app, passport) {

	//Render Logged in
	app.get('/login', function(req,res){
		res.render('login.ejs', {message: req.flash('loginMessage')});
	});

	//app.use('/product', notLoggedIn, function(req,res,next){
	//	next();
	//});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	//Render Sign Up
	app.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage')});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	//Render Profile
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', {
			user: req.user
		});
	});

	//Redirect Login Page
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/product');
	});
};

var isLoggedIn = function(req, res, next){
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
};

var notLoggedIn = function (req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/product');
}