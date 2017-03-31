const Cart = require('../models/cart');
const Order = require('../models/order');

module.exports = function (app, passport) {

	//Render Logged in
	app.get('/login', function(req,res){
		res.render('account/login.ejs', {message: req.flash('loginMessage')});
	});

	app.post('/login', passport.authenticate('local-login', {
		failureRedirect: '/login',
		failureFlash: true
	}), function(req, res, next){
		if(req.session.oldUrl){
			res.redirect(req.session.oldUrl);
			req.session.oldUrl = null;
		} else {
			res.redirect('/profile')
		}
	});

	//Render Sign Up
	app.get('/signup', function(req, res){
		res.render('account/signup.ejs', { message: req.flash('signupMessage')});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		failureRedirect: '/signup',
		failureFlash: true
	}), function(req, res, next){
		if(req.session.oldUrl){
			var oldUrl = req.session.oldUrl
			req.session.oldUrl = null;
			res.redirect(oldUrl); 
		} else {
			res.redirect('/profile')
		}
	});

	//Render Profile
	app.get('/profile', isLoggedIn, function(req, res){
		var cart = new Cart(req.session.cart ? req.session.cart: {});
		Order.find({user: req.user}, function(err, orders){
			if(err){
				return res.write('Error');
			}
			orders.forEach( function(order) {
				cart = new Cart(order.cart);
				order.items = cart.generateArray();
			});
			res.render('account/profile.ejs', {
				session: req.user,
				totalQty: cart.totalQty,
				totalPrice: cart.totalPrice,
				orders: orders
			});
		});
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