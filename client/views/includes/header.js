Template.header.helpers({
	pageTitle: function () {
		Session.set('pageTitle', 'Chatto');
		return Session.get('pageTitle');
	},
	unreadConversationsCount: function () {
		if (Meteor.user()) {
			var count = Notifications.find({notifiedId: Meteor.userId(), count: {$gt: 0}}).count();
			if (count > 0) {
				return count;
			}
		}
	}
});

Template.header.rendered = function () {
	if ($('#unreadConversations').html() === '0') {
		$('#unreadConversations').addClass('hidden');
	}
}