Meteor.publish('messages', function() {
  return Messages.find();
});

Meteor.publish('conversations', function () {
	return Conversations.find();
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