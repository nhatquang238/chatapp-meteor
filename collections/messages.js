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
			type: Date,
			label: 'Submitted Time'
		}
	})
});

Meteor.methods({
	sendMsg: function (message, receiver) {
		// ensure the user is logged in
		if(!Meteor.user())
			throw new Meteor.Error(401, "You need to login to send new messages");
		var messageId = Messages.insert(message);
		return messageId;
	},
	deleteMsgs: function (conversationId) {
		if (!Meteor.user())
			throw new Meteor.Error(401, "You need to login to delete messages");
		Messages.remove({conversationId: conversationId});
	}
});