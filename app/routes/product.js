const mongoose 	= require('mongoose');
const express = require('express');
const router = express.Router();
const passport = ('passport');
const Product = require('../models/product');
const Products = mongoose.model('Product');
const Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res) {
	var query = Products.find({});
	var cart = new Cart(req.session.cart ? req.session.cart: {});
	query.exec((error, products) => {
		if (error) 
			return res.status(404).send({success: false, error: error, message: 'Something went wrong.'});
		if (!products) 
			return res.status(200).send({success: false, message: 'Product item does not exist'});
		res.render('shop/index.ejs', { 
			success: true, 
			products: products, 
			session: req.user, 
			totalQty: cart.totalQty, 
			message: 'Successfully fetched the product.', 
			title: "Product Lists" });
		//response.json({success: true, menu: menu, message: 'Successfully fetched the product.'});
	});
});

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
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { products: null});
    } 
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', { 
    	products: cart.generateArray(), 
    	session: req.user,  
    	totalPrice: cart.totalPrice, 
    	totalQty: cart.totalQty, 
    	title: 'Shopping Cart'});
});
module.exports = router;
