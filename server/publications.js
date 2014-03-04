Meteor.publish('messages', function() {
  return Messages.find();
});

Meteor.publish('conversations', function () {
	return Conversations.find({members: Meteor.users.findOne(this.userId).username});
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