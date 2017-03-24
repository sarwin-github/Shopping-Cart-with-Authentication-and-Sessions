const mongoose 	= require('mongoose');
const express = require('express');
const router = express.Router();
const passport = ('passport');
const Product = require('../models/product');
const Products = mongoose.model('Product');
const Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(request, response) {
	var query = Products.find({});
	query.exec((error, products) => {
		if (error) 
			return response.status(404).send({success: false, error: error, message: 'Something went wrong.'});
		if (!products) 
			return response.status(200).send({success: false, message: 'Product item does not exist'});
		response.render('index.ejs', {success: true, products: products, session: request.user, message: 'Successfully fetched the product.', title: "Product Lists" });
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
        return res.render('shopping-cart', { products: null});
    } 
    var cart = new Cart(req.session.cart);
    res.render('shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice, title: 'Shopping Cart'});
});
module.exports = router;
