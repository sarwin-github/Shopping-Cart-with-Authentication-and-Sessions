var mongoose 	= require('mongoose');
var Product = require('../models/product');
var Products = mongoose.model('Product');

module.exports = function(app, passport){
	app.get('/product/create', isLoggedIn, function(req, res) {
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
};

var isLoggedIn = function(req, res, next){
	if(req.isAuthenticated())
		return next();
	res.redirect('/login');
};