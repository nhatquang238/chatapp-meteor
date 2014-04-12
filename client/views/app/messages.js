Template.messages.helpers({
	messages: function () {
		return Messages.find({}, {sort: {submittedTime: 1}});
	},
	hideLoadMoreClass: function () {
		if (Messages.find({conversationId: Router.current().params._id}).count() < INITIAL_LIMIT) {
			return 'hide';
		}
	}
});
