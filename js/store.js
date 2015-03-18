
module.exports=Store;

var config = require('./config');

var cookieRegex =  /^(\w*=\w*)/;

function Store(proxy){
	this.proxy = proxy;
}

/**
 * Login a user
 * (User remains logged in and all subsequet actions are performed by this user until logout is called)
 * See https://docs.wso2.com/display/AM170/Store+APIs#StoreAPIs-Login
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
		var cookies = raw.getResponseHeader('Set-Cookie');
		var headers=[];
    for (i=0, m=cookies.length; i<m; i++) {
      var cookie = cookieRegex.exec(cookies[i]);
      if (cookie && cookie.length >0){
        headers.push(cookie[0]);
      }
    }
    if (_this.proxy.config.debug) console.log('Cookie Headers', headers);
    _this.proxy.cookie=headers;
		callback (err,resp);
	});
};

/**
 * Logout a user
 * See https://docs.wso2.com/display/AM170/Store+APIs#StoreAPIs-Logout
 * 
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
			_this.proxy.cookie = [];
		}
		callback(err, resp);
	});
};

/**
 * Registers a new user
 * See https://docs.wso2.com/display/AM170/Store+APIs#StoreAPIs-UserSignup
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
 * See https://docs.wso2.com/display/AM170/Store+APIs#StoreAPIs-GetallPaginatedPublishedAPIs
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
 * See https://docs.wso2.com/display/AM170/Store+APIs#StoreAPIs-AddaSubscription
 *
 * @param { name: 'ApiName', version: '0.0.1' , provider: 'Zzish', tier:'Unlimmied', applicationId: 1 } data
 * @param {function (err, resp)} callback to be invoked
 */
Store.prototype.subscribe = function(data, callback){
	var request = {
		url: this.proxy.buildUrl(config.store.base, config.store.subscribe),
		data: {
			action: 'addSubscription',
			name: data.name,
			version: data.version, 
			provider: data.provider,
			tier: data.tier || 'Unlimited', 
			applicationId: data.applicationId
		}
	};
	this.proxy.ajax(request, function(err, resp){
			if (err === null && resp.error === false) {
			callback(err, resp.status);
		} else {
			callback(err, resp);
		}
	});
};


/**
 * Add an new application
 * https://docs.wso2.com/display/AM170/Store+APIs#StoreAPIs-GetApplications
 *
 * @param {application: 'MyApplication', tier : 'Unlimited', description: 'MyApp does stuff', callbackUrl: 'https://kanzi.co.uk/callback'} data to be passed to API Manager
 * @param {function (err, resp)} callback to be invoked
 * The resp (assuming err is null) will contain an array of applications, for example:
 */
Store.prototype.application = function(data, callback) {
	var request = {
		url: this.proxy.buildUrl(config.store.base, config.store.application),
		data: {
			action: 'addApplication',
			application: data.application,
			description: data.description || 'Default description',
			tier: data.tier || 'Unlimited',
			callbackUrl: data.callbackUrl || ''
		}
	};
	this.proxy.ajax(request, function(err, resp){
		if (err === null && resp.error === false) {
			callback(err, resp.status);
		} else {
			callback(err, resp);
		}
	});
};

/**
 * Gets a list of the user's applications
 * https://docs.wso2.com/display/AM170/Store+APIs#StoreAPIs-GetApplications
 *
 * @param {function (err, resp)} callback to be invoked
 * The resp (assuming err is null) will contain an array of applications, for example:
 * [{"name" : "DefaultApplication", "tier" : "Unlimited", "id" : 1, "callbackUrl" : null, "status" : "APPROVED", "description" : null}]
 */
Store.prototype.applications = function(callback) {
	var request = {
		url: this.proxy.buildUrl(config.store.base, config.store.listApps),
		data: {action: 'getApplications'},
		method : 'GET'
	};
	this.proxy.ajax(request, function(err, resp){
		if (err === null && resp.error === false) {
			callback(err, resp.applications);
		} else {
			callback(err, resp);
		}
	});
};


/**
 * Generate token
 * (undocumented API)
 *
 * @param {application: 'MyApplication', keytype: 'PRODUCTION', callbackUrl: 'http://kanzi.co.uk/callback', authorizedDomains: 'ALL', validityTime: 3600} data to be passed
 * @param {function (err, resp)} callback to be invoked
 * The resp (assuming err is null) will contain an array of applications, for example:
 */
Store.prototype.generateToken = function(data, callback) {
	var request = {
		url: this.proxy.buildUrl(config.store.base, config.store.subscribe),
		data: {
			action: 'generateApplicationKey',
			application: data.application,
			keytype: data.keytype || 'PRODUCTION',
			callbackUrl: data.callbackUrl || '',
			authorizedDomains: data.authorizedDomains || '',
			validityTime: data.validityTime || 3600
		}
	};
	this.proxy.ajax(request, function(err, resp){
		if (err === null && resp.error === false) {
			callback(err, resp.data.key);
		} else {
			callback(err, resp);
		}
	});
};

/**
 * refreshToken token
 * (undocumented API)
 *
 * @param {application: 'MyApplication', keytype: 'PRODUCTION', callbackUrl: 'http://kanzi.co.uk/callback', authorizedDomains: 'ALL', validityTime: 3600} data to be passed
 * @param {function (err, resp)} callback to be invoked
 * The resp (assuming err is null) will contain an array of applications, for example:
 */
Store.prototype.refreshToken = function(data, callback) {
	var request = {
		url: this.proxy.buildUrl(config.store.base, config.store.subscribe),
		data: {
			action: 'refreshToken',
			application: data.application,
			keytype: data.keytype || 'PRODUCTION',
			callbackUrl: data.callbackUrl || '',
			authorizedDomains: data.authorizedDomains || '',
			validityTime: data.validityTime || 3600
		}
	};
	this.proxy.ajax(request, function(err, resp){
		if (err === null && resp.error === false) {
			callback(err, resp.data.key);
		} else {
			callback(err, resp);
		}
	});
};


