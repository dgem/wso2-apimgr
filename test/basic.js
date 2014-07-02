
var ApiMgr = require('../js/index');

module.exports.alwaysPass = function(test){
	test.expect(1);
	test.ok(true);
	test.done();
};

module.exports.loadsConfig = function(test){
	var apiMgr = new ApiMgr();
	test.expect(1);
	test.ok(apiMgr.config !== null);
	test.done();
};

module.exports.hasProxy = function(test){
	var apiMgr = new ApiMgr();
	test.expect(1);
	test.ok(apiMgr.proxy !== null);
	test.done();
};

module.exports.hasStore = function(test){
	var apiMgr = new ApiMgr();
	test.expect(1);
	test.ok(apiMgr.store !== null);
	test.done();
};

module.exports.hasStoreLogin = function(test){
	var apiMgr = new ApiMgr();
	test.expect(1);
	test.ok(apiMgr.store.login !== null);
	test.done();
};

