Conversations = new Meteor.Collection('conversations', {
	schema: new SimpleSchema({
		members: {
			type: Object,
			label: 'Members'
		}
	})
});