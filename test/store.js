

var ApiMgr = require('../js/index.js');

var apiMgr;
var now = Date.now();

var admin = {
	user: 'admin',
	pwd: 'admin'
};

var newUser = {
	username: 'user' + now,
	password: 'pAssw0rd',
	firstname: 'George',
	lastname: 'Doors',
	email: 'george'+now+'@doors.org'
};


module.exports.setUp= function(callback){
	apiMgr = new ApiMgr();
	callback();
};

module.exports.canLogin = function(test) {
	test.expect(1);
	apiMgr.store.login({ username: admin.user, password: admin.pwd },
		function(err, res) {
			test.ok(err === null);
			test.done();
		}
	);
};

module.exports.cannotLoginInvalidPassword = function(test) {
	test.expect(1);
	apiMgr.store.login({ username: admin.user, password: 'bad' },
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
	apiMgr.store.login({ username: admin.user, password: admin.pwd },
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
	apiMgr.store.login({ username: admin.user, password: admin.pwd },
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
	apiMgr.store.login({ username: admin.user, password: admin.pwd },
		function(err, res) {
			test.ok(err === null);
			var data = newUser;
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
	apiMgr.store.login({ username: admin.user, password: admin.pwd },
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

module.exports.canCreateApp = function(test){
	test.expect(3);
	apiMgr.store.login({ username: newUser.username, password: newUser.password },
		function(err, res) {
			test.ok(err === null);
			apiMgr.store.application({ application: 'App' + now }, function(err, resp){
				test.ok(err === null);
				test.equal(resp, 'APPROVED');
				test.done();
			});
		}
	);
};

module.exports.canSubscribeAPI = function(test) {
	test.expect(7);
	apiMgr.store.login({ username: newUser.username, password: newUser.password },
		function(err, res) {
			test.ok(err === null);
			apiMgr.store.apis({},function(err, resp){
				test.ok(err === null);
				test.ok(resp.length > 0);
				var api = resp[0];
				apiMgr.store.applications(function(err, resp) {
					test.ok(err === null);
					test.ok(resp.length > 0);
					var app = resp[0];
					apiMgr.store.subscribe({name: api.name, version: api.version, provider: api.provider, applicationId: app.id },
						function(err, resp){
							test.ok(err === null);
							test.equal(resp, 'UNBLOCKED');
							test.done();
						});
					}
				);
			});
		}
	);
};


module.exports.canGenerateKey = function(test) {
	test.expect(9);
	apiMgr.store.login({ username: newUser.username, password: newUser.password },
		function(err, res) {
			test.ok(err === null);
			apiMgr.store.applications(function(err, resp) {
				test.ok(err === null);
				test.ok(resp.length > 0);
				var app = resp[0];
				apiMgr.store.generateToken({application: app.name},
					function(err, resp){
						test.strictEqual(err, null);
						test.ok(resp.consumerKey);
						test.ok(resp.accessToken);
						test.equal(resp.keyState, 'APPROVED');
						test.ok(resp.consumerSecret);
						test.ok(resp.enableRegenarate);
						test.done();
					});
				}
			);
		});
};



