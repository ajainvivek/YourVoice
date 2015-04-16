var args = arguments[0] || {};
$.parentController = args.parentController;

//Bind Events to the registered buttons
$.showLoginBtn.addEventListener('click', showLoginBtnClicked);
$.showRegisterBtn.addEventListener('click', showRegisterBtnClicked);
$.cancelRegisterBtn.addEventListener('click', cancelActionButtonClicked);
$.cancelLoginBtn.addEventListener('click', cancelActionButtonClicked);

$.doLoginBtn.addEventListener('click', doLoginBtnClicked);
$.doRegisterBtn.addEventListener('click', doRegisterBtnClicked);

/**
* @desc: show login view hide other views
*/
function showLoginBtnClicked() {
	$.registerView.hide();
	$.homeView.hide();
	$.loginView.show();
};

/**
* @desc: show register view hide other views
*/
function showRegisterBtnClicked() {
	$.registerView.show();
	$.homeView.hide();
	$.loginView.hide();
};

/**
* @desc: go to home view on cancel button clicked
*/
function cancelActionButtonClicked() {
	$.registerView.hide();
	$.loginView.hide();
	// set the global login state to false
	Alloy.Globals.loggedIn = false;
	// display only the home state view
	$.homeView.show();
}

/**
* @desc: Login user validating the acs services
*/
function doLoginBtnClicked() {
	var user = Alloy.createModel('User');
	user.login($.email.value, $.password.value, userActionResponseHandler);
};

/**
* @desc: Create the user and login into the application
*/
function doRegisterBtnClicked() {
	if ($.acct_password.value !== $.acct_password_confirmation.value) {
		alert("Please re-enter information");
		return;
	}
	var params = {
		first_name : $.acct_fname.value,
		last_name : $.acct_lname.value,
		username : $.acct_username.value,
		email : $.acct_email.value,
		password : $.acct_password.value,
		password_confirmation : $.acct_password_confirmation.value,
	};
	var user = Alloy.createModel('User);
	user.createAccount(params, userActionResponseHandler);
};

/**
* @desc: login into the application
*/
function userActionResponseHandler(_resp) {
	if (_resp.success === true) {
		// Do stuff after successful login.
		Alloy.Globals.loggedIn = true;
		Alloy.Globals.CURRENT_USER = _resp.model;
		$.parentController.loginSuccessAction(_resp);
	} else {
		// Show the error message and let the user try again.
		alert("loginFailed", _resp.error.message);
		Alloy.Globals.CURRENT_USER = null;
		Alloy.Globals.loggedIn = false;
	}
};

$.open = function(_reset) {
	_reset && cancelActionButtonClicked();
	$.index.open();
};

$.close = function() {
	$.index.close();
};



