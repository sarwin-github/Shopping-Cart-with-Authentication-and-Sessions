var mongoose 	= require('mongoose');
var express = require('express');
var router = express.Router();
var Product = require('../models/product')
var Products = mongoose.model('Product');

/* GET home page. */
router.get('/', function(request, response) {
	var query = Products.find({});
	query.exec((error, products) => {
		if (error) {	
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		} 
		if (!products) {
			return response.status(200).send({success: false, message: 'Product item does not exist'});
		}
		response.render('index.ejs', {success: true, products: products, message: 'Successfully fetched the product.', title: "Product Lists" });
		//response.json({success: true, menu: menu, message: 'Successfully fetched the product.'});
	});
});

/* GET home page. */
router.post('/create', function(request, response) {
	var productItem = new Products(request.body);

    productItem.save((error, product) => {        
        if (error) {			
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		}
		if (!product) {	
			return response.status(200).send({success: false, message: 'Something went wrong.'});
		}
        response.json({success: true, product: product, message: 'Product Successfully Registered.'});
    });
});

module.exports = router;
