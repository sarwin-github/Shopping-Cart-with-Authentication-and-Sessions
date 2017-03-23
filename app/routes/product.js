var mongoose 	= require('mongoose');
var express = require('express');
var router = express.Router();
var passport = ('passport');
var Product = require('../models/product');
var Products = mongoose.model('Product');
var Cart = require('../models/cart');

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
	var cart = new Cart(req.session.cart ? req.session.cart: {items: {}});

	Products.findById(productId, function(err, product){
		if(err){
			return response.status(404).send({success: false, error: error, message: 'Something went wrong.'});
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/');
	});
});


module.exports = router;
