Meteor.publish('messages', function() {
  return Messages.find();
});

Meteor.publish('conversations', function () {
	return Conversations.find();
});