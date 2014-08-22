

var config = {};
config.debug = true;
//config.baseUrl = 'https://localhost:9443';
config.baseUrl = 'http://apigw.zzish.com:9763';
config.store = {
	base : 'store/site/blocks',
	login : 'user/login/ajax/login.jag',
	logout : 'user/login/ajax/login.jag',
	signup : 'user/sign-up/ajax/user-add.jag',
	listAPIs: 'api/listing/ajax/list.jag',
	subscribe: 'subscription/subscription-add/ajax/subscription-add.jag',
	listSubs: 'subscription/subscription-list/ajax/subscription-list.jag',
	delSub: 'subscription/subscription-remove/ajax/subscription-remove.jag',
	application: 'application/application-add/ajax/application-add.jag',
	listApps: 'application/application-list/ajax/application-list.jag',
	delApp: 'application/application-remove/ajax/application-remove.jag'
};
config.ajax = { 
	method: 'POST',
	dataEncode: 'form'
};


module.exports = config;

