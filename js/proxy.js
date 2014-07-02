
module.exports = Proxy;


// Shim for using xmlhttprequest in node
if (typeof window === 'undefined') {
	// running in node so use https://www.npmjs.org/package/xmlhttprequest
	XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

function Proxy(config) {
	//if (config.debug) console.log('Proxy instanciated, config:', JSON.stringify(config));
	this.config = config;
	this.cookie = null;
}

Proxy.prototype.ajax = function(request, callback) {
	var debug = this.config.debug, req, data;
	if (debug) console.log('Proxy.ajax', JSON.stringify(request));
	if (typeof request.method === 'undefined') {
		request.method = this.config.ajax.method;
	}
	req = new XMLHttpRequest();
	req.addEventListener('load', function() {
			response(this, callback, debug);
		}, false);
	req.addEventListener('error', function(){
			error(this, callback, debug);
		}, false);
	data = this.encode(request.data);
	if (request.method === 'GET') {
		request.url = request.url + '?' + data;
	}
	req.open(request.method, request.url, true);
	if (this.cookie) {
		req.withCredentials = true;
		req.setDisableHeaderCheck(true);
		req.setRequestHeader('Cookie', this.cookie);
	}
	if (debug) console.log('Proxy.ajax send', request.method, request.url, data);
	if (request.method === 'GET') {
		req.send();
	} else {
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.send(data);
	}
};

Proxy.prototype.buildUrl = function () {
	var result = this.config.baseUrl;
	for (var i=0, l = arguments.length; i < l; i++){
		result += '/' + arguments[i];
	}
	return result;
};

Proxy.prototype.encode = function (data) {
	var form = '';
	for (var name in data) {
		if (data.hasOwnProperty(name)) {
			if (form !== '') form += '&';	
			form += encodeURIComponent(name) + '=' + encodeURIComponent(data[name]);
			form.replace(/%20/g, '+');
		}
	}
	if (this.config.debug) console.log('Proxy.encode', data, form);
	return form;
};

function response(resp, callback, debug) {
	if (debug) console.log('Proxy.response recieved',resp.status, resp.responseText);
	var err = null, res = null;
	try {
		if (resp.status >= 200 && resp.status < 300) {
			res = JSON.parse(resp.responseText);
			if (res.error === true) {
				err = res;
				res = null;
			}
		} else {
			err = JSON.parse(resp.responseText);
		}
	} catch (e) {
		err = resp.responseText;
	}
	if (typeof callback === 'function') {
		callback (err, res, resp);
	}
}

function error(evt, callback, debug) {
	if (debug) console.log('Proxy.error', JSON.stringify(evt));
	callback(evt.currentTarget, null);
}
