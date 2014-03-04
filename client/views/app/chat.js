Template.chat.helpers({
	messagePreviews: function () {
		var messagePreviews = Conversations.find().fetch();
		var currentUser = Meteor.user().username;

		for (var i = 0; i < messagePreviews.length; i++) {
			var index = messagePreviews[i].members.indexOf(currentUser);
			messagePreviews[i].members.splice(index, 1);
		};

		return messagePreviews;
		// return Conversations.find();
	}
});

Template.chat.events({
	'click #new-conversation': function () {
		Router.go('newConversation');
	},
	'keypress #message-content': function (e) {
		if (e.keyCode === 13) {
			// new conversation
			if (window.location.pathname.indexOf('new') !== -1) {
				var receiver = $('#receiver').val();
				var currentUser = Meteor.user().username;
				var duplicate = false;
				var conversations = Conversations.find();
				var membersArray = [];

				membersArray.push(receiver);

				var newConversation = {
					members: membersArray
				};

				var newMessage = {
					userId: Meteor.user()._id,
					content: $('#message-content').val(),
					from: currentUser,
					to: receiver,
					submittedTime: Date.now(),
					readStatus: false
				}

				conversations.forEach(function (conversation) {
					if (conversation.members.indexOf(receiver) !== -1) {
						duplicate = true;
					}
				});

				if ((duplicate === false) && (newConversation.members.indexOf(currentUser) === -1)) {
					// if you havent messaged this person before and he's not yourself
					// go to a new conversation
					console.log('no duplicate');
					newConversation.members.push(currentUser);
					newConversation._id = Conversations.insert(newConversation);
					newMessage.conversationId = newConversation._id;
					newConversation.members = receiver;
					Messages.insert(newMessage);
					Router.go('conversation', newConversation);
				} else if ((duplicate === true) && (newConversation.members.indexOf(currentUser) === -1)) {
					// if you have messaged this person before and he is not yourself
					// switch to an existing conversation
					console.log('duplicate');
					newConversation.members.push(currentUser);
					var existingConversation = Conversations.findOne({members: newConversation.members});
					newMessage.conversationId = existingConversation._id;
					existingConversation.members = receiver;
					Messages.insert(newMessage);
					Router.go('conversation', existingConversation);
					existingConversation = null;
				}

				// clear memory
				newConversation = null;
				newMessage = null;
				$('#message-content').val('');
			} else if (window.location.pathname.indexOf('conversations') !== -1) {
				// switch to another existing conversation
				console.log('conversation');

			}
		}
	},
	'click .message-preview a': function (e) {
		var currentChatId = this._id;
		var targetConversation = this;
		console.log(targetConversation);
		targetConversation.members
			.splice(
				targetConversation.members
					.indexOf(Meteor.user().username),
					1);

		$('#'+currentChatId).removeClass('new').addClass('active');
		Meteor.subscribe('messages', {chatId: currentChatId});

		Router.go('conversation', targetConversation);
		$('#message-content').focus();
		currentChatId = null;
	}
});