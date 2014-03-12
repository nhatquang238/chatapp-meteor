Conversations = new Meteor.Collection('conversations', {
	schema: new SimpleSchema({
		members: {
			type: [String],
			label: 'Members'
		},
		unreadMsgsCount: {
			type: Number,
			label: 'Unread Messages Count'
		},
		lastSeenBy: {
			type: String,
			label: 'Last Seen By'
		}
	})
});

Meteor.methods({
	createConversation: function (conversation) {
		// ensure the user is logged in
		if(!Meteor.user())
			throw new Meteor.Error(401, "You need to login to create new conversation");

		var conversationId = Conversations.insert(conversation);
		return conversationId;
	}
});