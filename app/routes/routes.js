
module.exports = function (app, passport) {

	//Render Logged in
	app.get('/login', function(req,res){
		res.render('account/login.ejs', {message: req.flash('loginMessage')});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	//Render Sign Up
	app.get('/signup', function(req, res){
		res.render('account/signup.ejs', { message: req.flash('signupMessage')});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	//Render Profile
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('account/profile.ejs', {
			session: req.user
		});
	});

	//check if logged
	//app.use('/add-to-cart/:id', isLoggedIn, function(req, res){
	//	next();
	//});

	app.post('/logout', function (req, res, next) {
     	// delete the cookies that you need to delete
     	next();  // our logout handler will get called next
    });

	//Redirect Login Page
	app.get('/logout', function(req, res){
		req.logOut();
		req.session.destroy(function (err) {
		   res.redirect('/login');
		 });
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