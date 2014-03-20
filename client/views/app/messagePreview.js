Template.messagePreview.helpers({
	activeClass: function () {
		if (Meteor.user()) {
			if (this._id === Router.current().params._id)
				return 'active';
		}
	}
});