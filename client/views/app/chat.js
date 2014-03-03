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
					newMessage.conversationId = newConversation._id;
					Messages.insert(newMessage);
					Router.go('conversation', newConversation);
				} else if ((duplicate === true) && (newConversation.members !== username)) {
					console.log('duplicate conversation, redirect to exising path');
					var existingConversation = Conversations.findOne({members: newConversation.members});
					newMessage.conversationId = existingConversation._id;
					console.log(newMessage);
					Messages.insert(newMessage);
					Router.go('conversation', existingConversation);
				}

				$('#message-content').val('');
			} else {
				console.log('nothing');
			}
		}
	}
});