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
		 var successMsg = req.flash('success')[0];
		res.render('shop/index.ejs', { 
			success: true, 
			products: products, 
			session: req.user, 
			totalQty: cart.totalQty, 
			message: 'Successfully fetched the product.', 
			title: "Product Lists",
			successMsg: successMsg
		});
		//response.json({success: true, menu: menu, message: 'Successfully fetched the product.'});
	});
});

router.get('/product/create', isLoggedIn, function(req, res) {
		/*var productItem = new Products(request.body);

		productItem.save((error, product) => {        
			if (error) {			
				return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
			}
			if (!product) {	
				return response.status(200).send({success: false, message: 'Something went wrong.'});
		
        //response.json({success: true, product: product, message: 'Product Successfully Registered.'});
        res.render('product-create.ejs', { sucess: true, product: product, message: 'Added new product.'});
    });	}*/  
    	res.render('product-create.ejs', { sucess: true, session: req.user});
	});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/login');
}


