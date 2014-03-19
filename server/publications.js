Meteor.publish('messages', function(currentConversationId) {
  return Messages.find({conversationId: currentConversationId});
});

Meteor.publish('conversations', function (username) {
	return Conversations.find({members: username})
});

Meteor.publish('notifications', function (options) {
	return Notifications.find(options);
});

Meteor.publish('userData', function () {
	return Meteor.users.find(
		{},
		{
			fields: {
				services: 0,
				createdAt: 0
			}
		}
	);
});