Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  waitOn: function () {
  	return Meteor.subscribe('messages');
  }
});

Router.map(function() {
  this.route('chat', {
    path: '/',
    template: 'chat',
    data: function () {
    	var params = this.params;
    	return params;
    }
  });
  this.route('newConversation', {
  	path: '/new',
  	template: 'newConversation'
  });
});