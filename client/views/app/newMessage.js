Template.newMessage.helpers({
	rendered: function () {
		AutoCompletion.init('input#receiver');
	}
});

// Template.newMessage.settings = function (){
// 	return {
// 		position: "top",
// 		limit: 7,
// 		rules: [
// 			{
// 				token: '#',
// 				collection: Meteor.users,
// 				field: "username",
// 				template: Template.userPill
// 			}
// 		]
// 	}
// }

Template.newMessage.events({
	// 'keypress #receiver': function (e) {
	// 	if (e.keyCode === 13) {
	// 		var receiver = $('#receiver').val().toLowerCase();
	// 		_.each(Meteor.users.find().fetch(), function(user){
	// 			if (user.hasOwnProperty('username')) {
	// 				if (receiver === user.username.toLowerCase()) {
	// 					user.username
	// 				} else {
	// 					console.log('cannot find receiver');
	// 				}
	// 			}
	// 		});
	// 	};
	// },
	'keyup input#receiver': function () {
		AutoCompletion.autocomplete({
			element: 'input#receiver',
			collection: Meteor.users,
			field: 'username',
			limit: 7,
			sort: {
				username: 1
			}
		});
	}
});