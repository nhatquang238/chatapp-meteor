Template.newMessage.helpers({
});

Template.newMessage.events({
	'keypress #receiver': function (e) {
		if (e.keyCode === 13) {
			var receiver = $('#receiver').val().toLowerCase();
			_.each(Meteor.users.find().fetch(), function(user){
				if (user.hasOwnProperty('username')) {
					if (receiver === user.username.toLowerCase()) {
						console.log('find receiver ' + user.username);
					} else {
						console.log('cannot find receiver');
					}
				}
			});
		};
	}
});