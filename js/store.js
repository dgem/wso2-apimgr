
module.exports=Store;

var config = require('./config');

var cookieRegex =  /(JSESSIONID=\w*)/;

function Store(proxy){
	this.proxy = proxy;
}

/**
 * Login a user
 * (User remains logged in and all subsequet actions are performed by this user until logout is called)
 *
 * @param {username: 'xxx', password: 'yyy'} data
 * @param {function (err, resp)} callback to be invoked
 */
Store.prototype.login = function(data, callback){
	var _this = this;
	if (typeof data === 'object') data.action = 'login';
	var request = {
		url: this.proxy.buildUrl(config.store.base, config.store.login),
		data: data
	};
	this.proxy.ajax(request, function(err, resp, raw) {
		var cookie = raw.getResponseHeader('Set-Cookie');
		if (err === null && cookie !== null){
			cookie = cookieRegex.exec(cookie);
			if (cookie.length >0){
				cookie = cookie[0];
				_this.proxy.cookie = cookie;
			}
		}
		callback (err,resp);
	});
};

/**
 * Logout a user
 * @param {function (err, resp)} callback to be invoked
 */
Store.prototype.logout = function(callback){
	var _this = this;
	var request = {
		url : this.proxy.buildUrl(config.store.base, config.store.logout),
		data: {action:'logout'},
		method : 'GET'
	};
	this.proxy.ajax(request, function(err, resp) {
		if (err === null) {
			_this.proxy.cookie = null;
		}
		callback(err, resp);
	});
};

/**
 * Registers a new user
 *
 * @param {username: 'user1', password: 'xxx', firstname: 'George', lastname: 'Doors', email: 'george@doors.org'} data
 * @param {function (err, resp)} callback to be invoked
 * The resp (assuming err is null) will contain an array of applications, for example:
 * [{"name" : "DefaultApplication", "tier" : "Unlimited", "id" : 1, "callbackUrl" : null, "status" : "APPROVED", "description" : null}]
 */
Store.prototype.signup = function(data, callback){
	var allfields = data.firstname + '|' + data.lastname + '|' + data.email;
	var request = {
		url: this.proxy.buildUrl(config.store.base, config.store.signup),
		data : {action:'addUser', username: data.username, password: data.password, allFieldsValues: allfields}
	};
	this.proxy.ajax(request, callback);
};


/**
 * List APIs
 *
 * @param {start: 0, end: 100} data where start and end control pagination (defaults to 0->10)
 * @param {function (error, respose)} callback to be invoked
 * The response (assuming error is null) will contain a list of APIs, for example:
 */
Store.prototype.apis = function(data, callback) {
	if (data === null) data = {};
	var request = {
		url: this.proxy.buildUrl(config.store.base, config.store.listAPIs),
		data : {
			action: 'getAllPaginatedPublishedAPIs',
			start: data.start || 0,
			end: data.end || 10
		},
		method : 'GET'
	};
	this.proxy.ajax(request, function(err, resp){
		if (err === null && resp.error === false) {
			callback(err, resp.apis);
		} else {
			callback(err, resp);
		}
	});
};

/**
 * Subscribe to an API
 *
 * @param {
 */



/**
 * Gets a list of the user's applications
 *
 * @param {function (err, resp)} callback to be invoked
 * The resp (assuming err is null) will contain an array of applications, for example:
 * [{"name" : "DefaultApplication", "tier" : "Unlimited", "id" : 1, "callbackUrl" : null, "status" : "APPROVED", "description" : null}]
 */
Store.prototype.applications = function(callback) {
	var request = {
		url: this.proxy.buildUrl(config.store.base, config.store.listApps),
		data: {action: 'getApplications'}
	};
	this.proxy.ajax(request, function(err, resp){
		if (err === null && resp.error === false) {
			callback(err, resp.applications);
		} else {
			callback(err, resp);
		}
	});
};


