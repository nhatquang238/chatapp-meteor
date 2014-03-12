Messages = new Meteor.Collection('messages', {
	schema: new SimpleSchema({
		userId: {
			type: String,
			label: 'UserId'
		},
		content: {
			type: String,
			label: 'Content'
		},
		conversationId: {
			type: String,
			label: 'ConversationId'
		},
		from: {
			type: String,
			label: 'From'
		},
		to: {
			type: [String],
			label: 'To'
		},
		submittedTime: {
			type: Number,
			optional: true,
			label: 'Submitted Time'
		}
	})
});

Meteor.methods({
	sendMsg: function (message) {
		// ensure the user is logged in
		if(!Meteor.user())
			throw new Meteor.Error(401, "You need to login to send new messages");

		var messageId = Messages.insert(message);
		return messageId;
	}
});