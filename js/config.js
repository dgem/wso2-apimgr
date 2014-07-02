

var config = {};
config.debug = true;
//config.baseUrl = 'https://localhost:9443';
config.baseUrl = 'http://localhost:9763';
config.store = {
	base : 'store/site/blocks',
	login : 'user/login/ajax/login.jag',
	logout : 'user/login/ajax/login.jag',
	signup : 'user/sign-up/ajax/user-add.jag',
	listApps: 'application/application-list/ajax/application-list.jag',
	listAPIs: 'api/listing/ajax/list.jag'
};
config.ajax = { 
	method: 'POST',
	dataEncode: 'form'
};


module.exports = config;

