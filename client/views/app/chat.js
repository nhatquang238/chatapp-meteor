Template.chat.helpers({
	messagePreviews: function () {
		if (Meteor.user()) {
				var messagePreviews = Conversations.find().fetch();
				var currentUser = Meteor.user().username;

				for (var i = 0; i < messagePreviews.length; i++) {
					var index = messagePreviews[i].members.indexOf(currentUser);
					messagePreviews[i].members.splice(index, 1);
				};

				return messagePreviews;
		}
	},
	isNotReceiver: function () {
		console.log(this);
		if ((Meteor.userId() !== this.lastSeenBy) && (this.unreadMsgsCount !== 0)) {
			return true;
		} else {
			return false;
		}
	}
});

Template.chat.rendered = function () {
	$('#'+Router.current().params._id).removeClass('new').addClass('active');
}

Template.chat.events({
	'click #new-conversation': function () {
		Router.go('newConversation');
	},
	'keypress #message-content': function (e) {
		if (e.keyCode === 13) {
			// new conversation
			var scrollTo = function () {
				var dist = $('.messages').height()-$('.main-container').height();
				$('.main-container').scrollTop(dist);
				dist = null;
			};

			if (window.location.pathname.indexOf('new') !== -1) {
				var receiver = $('#receiver').val();
				var currentUser = Meteor.user().username;
				var duplicate = false;
				var userExist = false;
				var membersArray = [receiver];
				var newConversation = {
					members: membersArray,
					unreadMsgsCount: 0,
					lastSeenBy: Meteor.userId()
				};

				var newMessage = {
					userId: Meteor.userId(),
					content: $('#message-content').val(),
					from: currentUser,
					to: [receiver],
					submittedTime: Date.now()
				}

				Conversations.find().forEach(function (conversation) {
					if (conversation.members.indexOf(receiver) !== -1) {
						duplicate = true;
					}
				});

				if (Meteor.users.findOne({username: receiver})) {
					userExist = true;
				} else {
					alert('user does not exist');
					$('#message-content').val('');
					$('#receiver').val('').focus();
				}

				if ((duplicate === false) && (newConversation.members.indexOf(currentUser) === -1) && (userExist === true)) {
					// if you havent messaged this person before and he's not yourself
					// go to a new conversation
					newConversation.members.push(currentUser);
					newMessage.conversationId = Conversations.insert(newConversation);
					// newMessage.conversationId = Meteor.call('createConversation', newConversation, function (error, id) {
					// 	if (error)
					// 		return alert(error.reason);
					// });

					Meteor.call('sendMsg', newMessage, function (error, id) {
						if (error)
							return alert(error.reason);

						Router.go('conversations', {_id: newConversation._id});

						Conversations.update(newConversation._id, {$inc: {unreadMsgsCount: 1}});
					});
				} else if ((duplicate === true) && (newConversation.members.indexOf(currentUser) === -1)) {
					// if you have messaged this person before and he is not yourself
					// switch to an existing conversation
					newConversation.members.push(currentUser);

					var existingConversation = Conversations.findOne({members: {$all: newConversation.members}});

					if (existingConversation) {
						newMessage.conversationId = existingConversation._id;

						Meteor.call('sendMsg', newMessage, function (error, id) {
							if (error)
								return alert(error.reason);

							Router.go('conversations', {_id: existingConversation._id});

							Conversations.update(existingConversation._id, {$inc: {unreadMsgsCount: 1}});

							existingConversation = null;
							$('#message-content').val('');
						});
					} else {
						console.log('smth is wrong');
					}
				}
			} else if (window.location.pathname.indexOf('conversations') !== -1) {
				// send message when in an existing conversation
				var existingConversation = Conversations.findOne({_id: Router.current().params._id });
				var currentUser = Meteor.user().username;
				var receiver = existingConversation.members.splice(currentUser,1);

				var newMessage = {
					userId: Meteor.userId(),
					content: $('#message-content').val(),
					from: currentUser,
					to: receiver,
					submittedTime: Date.now(),
					conversationId: existingConversation._id
				};

				Meteor.call('sendMsg', newMessage, function (error, id) {
					if (error)
						return alert(error.reason);

					// increase unread counter if another message is sent by the current sender
					// reset if otherwise
					if (Meteor.userId() === existingConversation.lastSeenBy) {
						Conversations.update(newMessage.conversationId, {$inc: {unreadMsgsCount: 1}});
					} else {
						Conversations.update(newMessage.conversationId, {$set: {unreadMsgsCount: 1, lastSeenBy: Meteor.userId()}});
					}

					scrollTo();
					$('#message-content').val('');
				});
			}
		}
	},
	'click .message-preview a': function (e) {
		var currentChatId = this._id;
		$('.message-preview').removeClass('active');
		$('#'+currentChatId).addClass('active');

		Router.go('conversations', this);

		// reset unreadMsgsCount and lastSeenBy if the receivers check their conversations
		if (Meteor.userId() !== this.lastSeenBy) {
			Conversations.update(this._id, {$set: {lastSeenBy: Meteor.userId(), unreadMsgsCount: 0}});
		}

		$('#message-content').focus();
		currentChatId = null;
	}
});