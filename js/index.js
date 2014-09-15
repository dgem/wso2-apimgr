


module.exports=ApiMgr;

var Proxy = require('./proxy');
var config = require('./config');
var Store = require('./store');
//var Utils = require('./utils');


function ApiMgr(config2){
	if (typeof config2 === 'object') {
		config.baseUrl = config2.baseUrl
	}
	this.proxy = new Proxy(config);
	this.store = new Store(this.proxy);
}





