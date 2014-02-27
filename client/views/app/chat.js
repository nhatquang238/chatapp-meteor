Template.chat.helpers({
	messages: function () {
		return Messages.find();
	},
	messagePreviews: function () {
		return Conversations.find();
	}
});

Template.chat.events({
});