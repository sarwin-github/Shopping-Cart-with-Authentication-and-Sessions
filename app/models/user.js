const mongoose = require('mongoose')
,	bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local: {
		email 		 : String,
		password 	 : String,
        name         : String,
        about        : String,
        address      : String,
        phone        : String,
        country      : String,
        points       : Number
	},
	facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);