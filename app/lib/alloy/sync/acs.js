function S4() {
	return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}

function guid() {
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter(config) {
	Cloud = require("ti.cloud");
	Cloud.debug = !0;
	config.Cloud = Cloud;
}


/**
* @desc: This is a separate handler for when the object being processed
* 		 is an ACS Users - CRUD
* @param: {Array/Object} model - User Model
* @param: {String} method - create/read/update/delete
* @param: {Object} options - alternate options
*/
function processACSUsers(model, method, options) {
	switch (method) {
		case "create":			
		break;
		case "read":
		break;
		case "update":
		case "delete":
			// Not currently implemented, let the user know
			alert("Not Implemented Yet");
		break;
	}
}

function Sync(method, model, options) {
	var object_name = model.config.adapter.collection_name;
	if (object_name === "users") {
		processACSUsers(model, method, options);
	}
}

var _ = require("alloy/underscore")._;
module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
	config = config || {};
	config.data = {};
	InitAdapter(config);
	return config;
};

module.exports.afterModelCreate = function(Model) {
	Model = Model || {};
	Model.prototype.config.Model = Model;
	return Model;
};


