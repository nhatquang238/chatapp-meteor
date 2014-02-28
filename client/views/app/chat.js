Template.chat.helpers({
	messagePreviews: function () {
		return Conversations.find();
	}
});

Template.chat.events({
	'click #new-conversation': function () {
		Router.go('newConversation');
	}
});