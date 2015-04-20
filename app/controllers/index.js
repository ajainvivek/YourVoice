// when we start up, create a user and log in
var user = Alloy.createModel('User');
var abx = require('com.alcoapps.actionbarextras');
var win = $.tabGroup,
    IconicFont = require('IconicFont'),
    fa = new IconicFont({
	font : 'FontAwesome'
});

/**
 * @desc: load the actionbarextras module
 */
// NOTE: make sure that your window is open
// before you access the actionbar with abx
function doOpen(e) {
	var activity = win.getActivity();
	// setting extras
	// set extras once the Activity is available
	abx.title = "YourVoice";
	abx.titleFont = "Chunkfive.otf";
	abx.titleColor = "#FFFFFF";
	abx.backgroundColor = "#EF1A3A";

	if (activity) {
		activity.onCreateOptionsMenu = function(e) {
			// aboutBtn and creditsBtn will be displayed in the menu overflow
			aboutBtn = e.menu.add({
				title : "About",
				showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
			});

			aboutBtn.addEventListener("click", function(e) {
				console.log('Clicked on About');
			});

			creditsBtn = e.menu.add({
				title : "Logout",
				showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
			});

			creditsBtn.addEventListener("click", function(e) {
				user.logout(function() {
					$.userNotLoggedInAction();
				});
			});
		};
	}
};

/**
 * @desc: authenticated user is logged when the application is closed
 */
$.userLoggedInAction = function() {
	user.showMe(function(_response) {
		if (_response.success === true) {
			$.loginSuccessAction(_response);
		} else {
			alert("Application Error\n " + _response.error.message);
			Ti.API.error(JSON.stringify(_response.error, null, 2));
			// go ahead and do the login
			$.userNotLoggedInAction();
		}
	});
};

/**
 * @desc: on successful login open the tabGroup
 */
$.loginSuccessAction = function(_options) {
	Ti.API.info('logged in user information');
	Ti.API.info(JSON.stringify(_options.model, null, 2));
	// open the main screen
	$.tabGroup.open();

	// set tabGroup to initial tab, in case this is coming from
	// a previously logged in state
	$.tabGroup.setActiveTab(0);

	// get the current user
	Alloy.Globals.currentUser = _options.model;

	// set the parent controller for all of the tabs, give us
	// access to the global tab group and misc functionality
	$.recentController.parentController = $;
	$.trendingController.parentController = $;
	$.myvoiceController.parentController = $;

	// do any necessary cleanup in login controller
	$.loginController && $.loginController.close();
};

/**
 * @desc: unauthenticated user redirect to home
 */
$.userNotLoggedInAction = function() {
	// open the login controller to login the user
	if (!$.loginController) {
		var loginController = Alloy.createController("login", {
			parentController : $,
			reset : true
		});
		// save controller so we know not to create one again
		$.loginController = loginController.getView();
	}
	// open the window
	$.loginController.open();

};

//Check user is authenticated or not
if (user.authenticated() === true) {
	$.userLoggedInAction();
} else {
	$.userNotLoggedInAction();
}

//Load dummy collections data
$.tabGroup.addEventListener("open", function() {
	Alloy.Collections.survey.reset([{
		"question" : "What you feel about ipl 1?",
		"options" : [{
			"id" : 1,
			"value" : "I was not very much impressed because of arious reasons",
			"poll" : 10
		}, {
			"id" : 2,
			"value" : "bad",
			"poll" : 4343
		}],
	}, {
		"question" : "What you feel about ipl 2?",
		"options" : [{
			"id" : 1,
			"value" : "I was not very much impressed because of arious reasons",
			"poll" : 33
		}, {
			"id" : 2,
			"value" : "bad",
			"poll" : 0
		}],
	}, {
		"question" : "What you feel about ipl 3?",
		"options" : [{
			"id" : 1,
			"value" : "I was not very much impressed because of arious reasons",
			"poll" : 0
		}, {
			"id" : 2,
			"value" : "bad",
			"poll" : 0
		}],
	}]);
});
