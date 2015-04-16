exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "users"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			/**
			* @desc: log user in with username and password
			*
			* @param {String} _login
			* @param {String} _password
			* @param {Function} _callback
			*/
			login : function(_login, _password, _callback) {
				var self = this;
				this.config.Cloud.Users.login({
					login : _login,
					password : _password
				}, function(e) {
					if (e.success) {
						var user = e.users[0];
						// save session id
						Ti.App.Properties.setString('sessionId', e.meta.session_id);
						Ti.App.Properties.setString('user', JSON.stringify(user));
						_callback && _callback({
							success : true,
							model : new model(user)
						});
					} else {
						Ti.API.error(e);
						_callback && _callback({
							success : false,
							model : null,
							error : e
						});
					}
				});
			},
			
			/**
			* @desc: create account with user info provided
			*
			* @param {Object} _userInfo
			* @param {Function} _callback
			*/
			createAccount: function(_userInfo, _callback) {
				var cloud = this.config.Cloud;
				var TAP = Ti.App.Properties;
				// bad data so return to caller
				if (!_userInfo) {
					_callback && _callback({
						success : false,
						model : null
					});
				} else {
					cloud.Users.create(_userInfo, function(e) {
						if (e.success) {
							var user = e.users[0];
							TAP.setString("sessionId",e.meta.session_id);
							TAP.setString("user",JSON.stringify(user));
							// set this for ACS to track session connected
							cloud.sessionId = e.meta.session_id;
							// callback with newly created user
							_callback && _callback({
								success: true,
								model: new model(user)
							});
						} else {
							Ti.API.error(e);
							_callback && _callback({
								success: false,
								model: null,
								error: e
							});
						}
					});
				}
			},
			
			/**
			* @desc: logout remove session id from global properties
			*
			* @param {Function} _callback
			*/
			logout: function(_callback) {
				var cloud = this.config.Cloud;
				var TAP = Ti.App.Properties;
				cloud.Users.logout(function(e) {
					if (e.success) {
						//var user = e.users[0];
						TAP.removeProperty("sessionId");
						//TAP.removeProperty("user");
						// callback clearing out the user model
						_callback && _callback({
							success: true,
							model: null
						});
					} else {
						Ti.API.error(e);
						_callback && _callback({
							success: false,
							model: null,
							error: e
						});
					}
				});
			},
			
			/**
			* @desc: authenticates the user based on session id bound to the application
			*/
			authenticated : function() {
				var cloud = this.config.Cloud;
				var TAP = Ti.App.Properties;
				if (TAP.hasProperty("sessionId")) {
					Ti.API.info("SESSION ID " + TAP.getString("sessionId"));
					cloud.sessionId = TAP.getString("sessionId");
					return true;
				}
				return false;
			},
			
			/**
			* @desc: retrieve the logged in user based on session
			*
			* @param {Function} _callback
			*/
			showMe: function(_callback) {
				var cloud = this.config.Cloud;
				var TAP = Ti.App.Properties;
				cloud.Users.showMe(function(e) {
					if (e.success) {
						var user = e.users[0];
						TAP.setString("sessionId", e.meta.session_id);
						TAP.setString("user", JSON.stringify(user));
						_callback && _callback({
							success: true,
							model: new model(user)
						});
					} else {
						Ti.API.error(e);
						TAP.removeProperty("sessionId");
						TAP.removeProperty("user");
						_callback && _callback({
							success: false,
							model: null,
							error: e
						});
					}
				});
			}
			// end extend
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};