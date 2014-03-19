Meteor.publish('messages', function(currentConversationId) {
  return Messages.find({conversationId: currentConversationId});
});

Meteor.publish('conversations', function (username) {
	// return Conversations.find({members: Meteor.users.findOne(this.userId).username});
	return Conversations.find({members: username})
});

// Meteor.publish('notifications', function (userId) {
// 	return Notifications.find({sentId: userId});
// });

Meteor.publish('notifications', function () {
	return Notifications.find();
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