const mongoose 	= require('mongoose');
const express = require('express');

const Product = require('../models/product');
const Products = mongoose.model('Product');
const Cart = require('../models/cart');
const Order = require('../models/order');

const router = express.Router();

router.get('/add-to-cart/:id', function(req, res, next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart: {});

	Products.findById(productId, function(err, product){
		if(err){
			return response.status(404).send({success: false, error: error, message: 'Something went wrong.'});
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('/');
		console.log(req.session.cart);
	});
});

router.get('/shopping-cart', function(req, res, next) {
    var cart = new Cart(req.session.cart ? req.session.cart: {});
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { 
        products: null, 
        totalPrice: cart.totalPrice, 
    	totalQty: cart.totalQty, 
    	items: null,
    	session: req.user });
    } 

    res.render('shop/shopping-cart', { 
    	session: req.user, 
    	products: cart.generateArray(), 
    	totalPrice: cart.totalPrice, 
    	totalQty: cart.totalQty });
});

router.get('/reduce/:id', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart: {});
    
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart: {});
    
    cart.removeItems(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
    var cart = new Cart(req.session.cart ? req.session.cart: {});
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { 
        products: null, 
        totalPrice: cart.totalPrice, 
        totalQty: cart.totalQty, 
        items: null,
        session: req.user });
    } 
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', { 
        session: req.user, 
        products: cart.generateArray(), 
        totalPrice: cart.totalPrice, 
        totalQty: cart.totalQty,
        errMsg: errMsg, noError: !errMsg });
});


router.post('/checkout', isLoggedIn, function(req, res, next) {
    var cart = new Cart(req.session.cart ? req.session.cart: {});

    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { 
        products: null, 
        totalPrice: cart.totalPrice, 
        totalQty: cart.totalQty, 
        items: null,
        session: req.user });
    } 

    var stripe = require("stripe")(
      "sk_test_KaN6t8Jcb2HYq7fXxNTHqYs6"
    );

    stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: "usd",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Test Charge"
    }//, {
      //idempotency_key: "qlE0F0MioujzZhAn" }
    , function(err, charge) {
        if(err){
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }

        var order = new Order({
            user: req.user,
            cart: cart,
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            paymentId: charge.id
        });

        order.save(function(err, result){
            req.flash('success', 'Successfuly bought product');
            req.session.cart = null;
            res.redirect('/');
        });        
    });
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/login');
}