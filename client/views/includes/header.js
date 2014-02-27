Template.header.helpers({
	pageTitle: function () {
		Session.set('pageTitle', 'Chatto');
		return Session.get('pageTitle');
	}
});