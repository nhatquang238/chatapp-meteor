Template.chat.helpers({
	messagePreviews: function () {
		var messagePreviews = Conversations.find().fetch();
		var currentUser = Meteor.user().username;

		for (var i = 0; i < messagePreviews.length; i++) {
			var index = messagePreviews[i].members.indexOf(currentUser);
			messagePreviews[i].members.splice(index, 1);
		};

		return messagePreviews;
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
				var membersArray = [receiver];
				var newConversation = {
					members: membersArray
				};
				var newMessage = {
					userId: Meteor.user()._id,
					content: $('#message-content').val(),
					from: currentUser,
					to: [receiver],
					submittedTime: Date.now(),
					readStatus: false
				}
				var scrollTo = function () {
					var dist = $('.messages').height()-$('.main-container').height();
					$('.main-container').scrollTop(dist);
					dist = null;
				}

				Conversations.find().forEach(function (conversation) {
					if (conversation.members.indexOf(receiver) !== -1) {
						duplicate = true;
					}
				});

				if ((duplicate === false) && (newConversation.members.indexOf(currentUser) === -1)) {
					// if you havent messaged this person before and he's not yourself
					// go to a new conversation
					newConversation.members.push(currentUser);
					newConversation._id = Conversations.insert(newConversation);
					newMessage.conversationId = newConversation._id;

					console.log(newMessage);
					Meteor.call('send', newMessage, function (error, id) {
						if (error)
							return alert(error.reason);

						Router.go('conversations', {_id: newConversation._id});
					});
				} else if ((duplicate === true) && (newConversation.members.indexOf(currentUser) === -1)) {
					// if you have messaged this person before and he is not yourself
					// switch to an existing conversation
					newConversation.members.push(currentUser);

					var existingConversation = Conversations.findOne({members: {$all: newConversation.members}});
					if (existingConversation) {
						newMessage.conversationId = existingConversation._id;

						Meteor.call('send', newMessage, function (error, id) {
							if (error)
								return alert(error.reason);

							Router.go('conversations', {_id: existingConversation._id});
							existingConversation = null;
							$('#message-content').val('');
						});
					} else {
						console.log('smth is wrong');
					}
				}

				// clear memory
				// newConversation = null;
				// newMessage = null;
			} else if (window.location.pathname.indexOf('conversations') !== -1) {
				// send message when in an existing conversation
				var existingConversation = Conversations.findOne({_id: Router.current().params._id });
				var currentUser = Meteor.user().username;
				var receiver = existingConversation.members.splice(currentUser,1);

				var newMessage = {
					userId: Meteor.user()._id,
					content: $('#message-content').val(),
					from: currentUser,
					to: receiver,
					submittedTime: Date.now(),
					conversationId: existingConversation._id,
					readStatus: false
				};

				Meteor.call('send', newMessage, function (error, id) {
					if (error)
						return alert(error.reason);

					scrollTo();
					$('#message-content').val('');
				});
			}
		}
	},
	'click .message-preview a': function (e) {
		var currentChatId = this._id;

		$('.message-preview').removeClass('active');
		$('#'+currentChatId).removeClass('new').addClass('active');
		Meteor.subscribe('messages', {chatId: currentChatId});

		Router.go('conversations', this);
		$('#message-content').focus();
		currentChatId = null;
	}
});