Template.messages.helpers({
	messages: function () {
		return Messages.find();
	}
});

Template.messages.rendered = function () {
	var dist = $('.messages').height()-$('.main-container').height();
	$('.main-container').scrollTop(dist);
	dist = null;
}