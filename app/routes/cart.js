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

module.exports = router;