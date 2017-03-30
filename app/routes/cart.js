const mongoose 	= require('mongoose');
const express = require('express');

const Product = require('../models/product');
const Products = mongoose.model('Product');
const Cart = require('../models/cart');

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


router.get('/checkout', function(req, res, next) {
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


router.post('/checkout', function(req, res, next) {
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
        req.flash('success', 'Successfuly bought product');
        req.session.cart = null;
        res.redirect('/');
    });
});


module.exports = router;