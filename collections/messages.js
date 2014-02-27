Messages = new Meteor.Collection('messages', {
	schema: new SimpleSchema({
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
			type: String,
			label: 'To'
		},
		submittedTime: {
			type: Date,
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