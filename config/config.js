const config = {
	production:{
		SECRET: process.env.SECRET,
		DATABASE: 'mongodb://Valientine:misotu36@ds243931.mlab.com:43931/back-end_task'
	},
	default:{
		SECRET: 'SUPERSECRETPASS',
		DATABASE: 'mongodb://Valientine:misotu36@ds243931.mlab.com:43931/back-end_task'
	}
}

exports.get = function get(env){
	return config[env] || config.default;
}