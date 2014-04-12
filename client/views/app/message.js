Template.message.created = function () {
	var dist = $('.messages').height()-$('.main-container').height();
	$('.main-container').scrollTop(dist);
	dist = null;
}