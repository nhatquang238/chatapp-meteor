Template.messagePreview.helpers({
	activeClass: function () {
		if (Meteor.user()) {
			if (this._id === Router.current().params._id)
				return 'active';
		}
	},
	notifiedClass: function () {
		if (Meteor.user()) {
			var notification = Notifications.findOne({conversationId: this._id, notifiedId: Meteor.userId()});
			if (notification) {
				if (notification.count > 0) return 'notified';
			}
		}
	}
});