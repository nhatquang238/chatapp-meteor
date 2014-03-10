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
		},
		readStatus: {
			type: Boolean,
			optional: true,
			label: "Read Status"
		}
	})
});

Meteor.methods({
	send: function (message) {
		var user = Meteor.user();

		// ensure the user is logged in
		if(!user)
			throw new Meteor.Error(401, "You need to login to send new messages");

		var messageId = Messages.insert(message);
		return messageId;
	}
});