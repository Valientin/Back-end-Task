const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_I = 10;

let UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	googleId: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

UserSchema.pre('save', function(next){
	var user = this;

	if(user.isModified('password')){

		bcrypt.genSalt(SALT_I,function(err, salt){
			if(err) return next(err);

			bcrypt.hash(user.password, salt, function(err, hash){
				if(err) return next(err);
				user.password = hash;
				next();
			})
		})

	} else {
		next()
	}
})

const User = module.exports = mongoose.model('User', UserSchema);