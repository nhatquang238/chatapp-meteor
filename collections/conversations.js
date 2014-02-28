Conversations = new Meteor.Collection('conversations', {
	schema: new SimpleSchema({
		members: {
			type: String,
			label: 'Members'
		}
	})
});