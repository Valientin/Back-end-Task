const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const config = require('./config/config').get(process.env.NODE_ENV);

const app = express();

let User = require('./models/user');

//Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE, { useNewUrlParser: true }, () => {
	console.log('Connect to database');
})

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parser 
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
	secret: config.SECRET,
	resave: true,
	saveUninitialized: true
}));

//Express Messages Middleware
app.use(flash());
app.use(function(req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

//Express Validator Middleware
app.use(expressValidator())

//Passport config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
	res.locals.user = req.user || null;
	next();
});


// GET //
app.get('/', function(req, res){
	console.log(req.user);
	res.render('index', {
		title: 'Home',
		text: "Hello!",
		login: true,
		register: true
	});	
});

app.get('/login', function(req, res){
	if(req.isAuthenticated()){
		req.flash('danger', "You are login!");
		res.redirect('/');
	}else {
		res.render('login', {
			title: 'Login',
			login: true
		});
	}
});

app.get('/register', function(req, res){
	if(req.isAuthenticated()){
		req.flash('danger', "You are login!");
		res.redirect('/');
	}else {
		res.render('register', {
			title: 'Register',
			register: true
		});
	};
});

// POST //

app.post('/login', function(req, res, next){
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})(req, res, next);
});

app.post('/register', function(req, res){
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;
	const file = req.body.file;
	console.log(file);

	req.checkBody('name', 'Name min lenght is 5').isLength({ min: 5 });
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username min lenght is 5').isLength({ min: 5 });
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Password2 do not match').equals(req.body.password);

	let errors = req.validationErrors();

	if(errors) {
		res.render('register', {
			title: 'Register',
			errors: errors
		});
	} else {
		let newUser = new User({
			name,
			email,
			username,
			password
		});

		newUser.save(function(err){
			if(err){
				console.log(err);
				return;
			} else{
				req.flash('success', 'Now you can login');
				res.redirect('/login');
			}
		});
	}
});

//Logout
app.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You are logged out');
	res.redirect('/login');
})

// UPDATE //

// DELETE //



const port = process.env.PORT || 3000; 
app.listen(port,() => {
	console.log(`Server start on the port ${port}`)
})