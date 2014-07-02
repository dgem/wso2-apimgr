

var ApiMgr = require('../js/index.js');

var apiMgr;

module.exports.setUp= function(callback){
	apiMgr = new ApiMgr();
	callback();
};

module.exports.canLogin = function(test) {
	test.expect(1);
	apiMgr.store.login({ username: 'admin', password: 'admin' },
		function(err, res) {
			test.ok(err === null);
			test.done();
		}
	);
};

module.exports.cannotLoginInvalidPassword = function(test) {
	test.expect(1);
	apiMgr.store.login({ username: 'admin', password: 'bad' },
		function(err, res) {
			test.ok(err !== null);
			test.done();
		}
	);
};

module.exports.cannotLoginInvalidUser = function(test) {
	test.expect(1);
	apiMgr.store.login({ username: 'bad', password: 'admin' },
		function(err, res) {
			test.ok(err !== null);
			test.done();
		}
	);
};

module.exports.canListApps = function(test){
	test.expect(3);
	apiMgr.store.login({ username: 'admin', password: 'admin' },
		function(err, res) {
			test.ok(err === null);
			apiMgr.store.applications(function(err, resp){
				test.ok(err === null);
				test.ok(resp.length > 0);
				test.done();
			});
		}
	);
};

module.exports.canListAPIs = function(test){
	test.expect(3);
	apiMgr.store.login({ username: 'admin', password: 'admin' },
		function(err, res) {
			test.ok(err === null);
			apiMgr.store.apis({},function(err, resp){
				test.ok(err === null);
				test.ok(resp.length > 0);
				test.done();
			});
		}
	);
};

module.exports.canRegisterNewUser = function(test){
	test.expect(2);
	apiMgr.store.login({ username: 'admin', password: 'admin' },
		function(err, res) {
			test.ok(err === null);
			var now = Date.now();
			var data = {
				username: 'user' + now,
				password: 'pAssw0rd',
				firstname: 'George',
				lastname: 'Doors',
				email: 'george'+now+'@doors.org'
			};
			apiMgr.store.signup(data, function(err, res){
				console.log('callback', err, res);
				test.ok(err === null);
				test.done();
			});
		}
	);
};


module.exports.canLogout = function(test){
	test.expect(3);
	apiMgr.store.login({ username: 'admin', password: 'admin' },
		function(err, res) {
			test.ok(err === null);
			apiMgr.store.logout(function(err, resp){
				test.ok(err === null);
				apiMgr.store.applications(function(err, resp){
					test.ok(err !== null);
					test.done();
				});
			});
		}
	);
};




