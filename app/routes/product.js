const mongoose 	= require('mongoose');
const express = require('express');

const Product = require('../models/product');
const Products = mongoose.model('Product');
const Cart = require('../models/cart');

const router = express.Router();

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

module.exports = router;


