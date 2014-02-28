Template.chat.helpers({
	messagePreviews: function () {
		return Conversations.find();
	}
});

Template.chat.events({
	'click #new-conversation': function () {
		Router.go('newConversation');
	},
	'keypress #message-content': function (e) {
		if (e.keyCode === 13) {
			if (window.location.pathname == '/new') {
				var receiver = $('#receiver').val();
				var username = Meteor.user().username;
				var duplicate = false;
				var conversations = Conversations.find();
				// var membersArray = [];
				// membersArray.push(receiver);
				var newConversation = {
					// members: membersArray
					members: receiver
				};
				var newMessage = {
					content: $('#message-content').val(),
					from: username,
					to: receiver,
					submittedTime: Date.now(),
					readStatus: false
				}

				conversations.forEach(function (conversation) {
					if (conversation.members === newConversation.members) {
						duplicate = true;
					}
				});

				if ((duplicate === false) && (newConversation.members !== username)) {
					newConversation._id = Conversations.insert(newConversation);
					Messages.insert(newMessage);
					Router.go('conversation', newConversation);
				} else {
					console.log('can\'t make duplicate conversation or talk to yourself');
				}

				$('#message-content').val('');
			} else {
				console.log('nothing');
			}
		}
	}
});