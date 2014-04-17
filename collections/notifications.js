Notifications = new Meteor.Collection('notifications', {
	schema: new SimpleSchema({
		sentId: {
			type: String,
			label: 'Sent Id'
		},
		notifiedId: {
			type: [String],
			label: 'Notified Id'
		},
		conversationId: {
			type: String,
			label: 'Conversation Id'
		},
		read: {
			type: Boolean,
			label: 'Read'
		},
		count: {
			type: Number,
			label: 'Count'
		},
		createdAt: {
			type: Date,
			label: 'Created At'
		}
	})
});

Meteor.methods({
	notify: function (notification) {
		if (!Meteor.user())
			throw new Meteor.error(401, 'You need to login to create notification')

		var notificationId = Notifications.insert(notification);
		return notificationId;
	},
	deleteNotification: function (conversationId) {
		if (!Meteor.user())
			throw new Meteor.error(401, 'You need to login to create notification')

		Notifications.remove({conversationId: conversationId});
	}
})