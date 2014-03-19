Template.chat.helpers({
	messagePreviews: function () {
		if (Meteor.user()) {
			messagePreviews = Conversations.find().fetch();
			var currentUser = Meteor.user().username;

			for (var i = 0; i < messagePreviews.length; i++) {
				var index = messagePreviews[i].members.indexOf(currentUser);
				messagePreviews[i].members.splice(index, 1);
			};

			return messagePreviews;
		}
	},
	unreadMsgsCount: function () {
		if (Meteor.user()) {
			var  currentNotification = Notifications.findOne({notifiedId: Meteor.userId(), conversationId: this._id});
			if (currentNotification && (currentNotification.count > 0)) {
				return Notifications.findOne({notifiedId: Meteor.userId(), conversationId: this._id}).count;
			}
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
			var currentUser = Meteor.user().username;
			var scrollTo = function () {
				var dist = $('.messages').height()-$('.main-container').height();
				$('.main-container').scrollTop(dist);
				dist = null;
			};

			if (window.location.pathname.indexOf('new') !== -1) {
				var receiver = $('#receiver').val();
				var duplicate = false;
				var userExist = false;
				var membersArray = [currentUser, receiver];
				var newConversation = {
					members: membersArray
				};

				var newMessage = {
					userId: Meteor.userId(),
					content: $('#message-content').val(),
					from: currentUser,
					to: [receiver],
					submittedTime: new Date()
				}

				// check if the receiver exists
				if (Meteor.users.findOne({username: receiver})) {
					userExist = true;
					// Check if current user sends message to the receiver before
					if (Conversations.findOne({members: {$all: newConversation.members}})) {
						duplicate = true;
						var existingConversation = Conversations.findOne({members: {$all: newConversation.members}});
					}
				} else {
					alert('user does not exist');
					$('#message-content').val('');
					$('#receiver').val('').focus();
					duplicate = null;
				}

				if ((duplicate === false) && (existingConversation === undefined)) {
					// if you havent messaged this person before and he's not yourself
					// go to a new conversation
					newMessage.conversationId = Conversations.insert(newConversation);

					var newNotification = {
						sentId: Meteor.userId(),
						notifiedId: [Meteor.users.findOne({username: receiver})._id],
						conversationId: newMessage.conversationId,
						read: false,
						count: 1,
						createdAt: new Date()
					};

					Meteor.call('sendMsg', newMessage, function (error, id) {
						if (error)
							return alert(error.reason);
					});

					Meteor.call('notify', newNotification, function (error, id) {
						if (error)
							return alert(error.reason);

						Router.go('conversations', {_id: newMessage.conversationId});
					});
				} else if ((duplicate === true) && (existingConversation)) {
					// if you have messaged this person before and he is not yourself
					// switch to an existing conversation
					var newNotification = {
						sentId: Meteor.userId(),
						notifiedId: [Meteor.users.findOne({username: receiver})._id],
						conversationId: existingConversation._id,
						read: false,
						count: 1,
						createdAt: new Date()
					};

					newMessage.conversationId = existingConversation._id;

					Meteor.call('sendMsg', newMessage, function (error, id) {
						if (error)
							return alert(error.reason);

						Notifications.insert(newNotification);
						Router.go('conversations', {_id: existingConversation._id});

						$('#message-content').val('');
					});
				}
			} else if (window.location.pathname.indexOf('conversations') !== -1) {
				// send message when in an existing conversation
				var existingConversation = Conversations.findOne({_id: Router.current().params._id });
				var receiver = existingConversation.members.splice(currentUser,1);
				var newMessage = {
					userId: Meteor.userId(),
					content: $('#message-content').val(),
					from: currentUser,
					to: receiver,
					submittedTime: new Date(),
					conversationId: existingConversation._id
				};
				// clear current'user notification
				currentNotification = Notifications.findOne({notifiedId: Meteor.userId(), conversationId: existingConversation._id});
				if (currentNotification) {
					Notifications.update(currentNotification._id, {$set: {read: true, count: 0, createdAt: new Date()}});
				}

				Meteor.call('sendMsg', newMessage, receiver, function (error, id) {
					if (error)
						return alert(error.reason);

					// check if there's an exisiting notification from current user
					var notificationFromUser = Notifications.findOne({sentId: Meteor.userId(), conversationId: existingConversation._id});
					if (notificationFromUser) {
						// if the receiver has not read previous messages, increase count by 1
						// else reset his notification to 1
						if (notificationFromUser.read === false) {
							Notifications.update(notificationFromUser._id, {$inc: {count: 1},$set: {createdAt: new Date()}});
						} else {
							Notifications.update(notificationFromUser._id, {$set: {read: false, count: 1, createdAt: new Date()}});
						}
					} else {
						notificationFromUser = {
							sentId: Meteor.userId(),
							notifiedId: [Meteor.users.findOne({username: receiver[0]})._id],
							conversationId: newMessage.conversationId,
							read: false,
							count: 1,
							createdAt: new Date()
						};
						Notifications.insert(notificationFromUser);
					}

					scrollTo();
					$('#message-content').val('');
					existingConversation = null;
					receiver = null;
					newMessage = null;
				});
			}
		}
	},
	'click .message-preview a': function (e) {
		var currentConversationId = this._id;
		$('.message-preview').removeClass('active');
		$('#'+currentConversationId).addClass('active');

		Router.go('conversations', this);

		if (window.location.pathname.indexOf('conversations') !== -1) {
			var conversationId = Router.current().params._id;
			var currentNotification = Notifications.findOne({conversationId: conversationId, notifiedId: Meteor.userId()});
			if (currentNotification) {
				Notifications.update(currentNotification._id, {$set: {read: true, count: 0, createdAt: new Date()}});
			}
			conversationId = null;
		}

		currentConversationId = null;
	},
	'click #message-content': function () {
		if (window.location.pathname.indexOf('conversations') !== -1) {
			var conversationId = Router.current().params._id;
			var currentNotification = Notifications.findOne({conversationId: conversationId, notifiedId: Meteor.userId()});
			if (currentNotification) {
				Notifications.update(currentNotification._id, {$set: {read: true, count: 0, createdAt: new Date()}});
			}
			conversationId = null;
		}
	}
});