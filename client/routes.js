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
    yieldTemplates: {
    	'messages': {to: 'messages'}
    }
  });
  this.route('newConversation', {
  	path: '/new',
  	template: 'chat',
  	yieldTemplates: {
  		'newMessage': {to: 'newMessage'}
  	}
  });
  this.route('conversation', {
  	path: '/conversations/:members',
  	template: 'chat',
  	yieldTemplates: {
  		'messages': {to: 'messages'}
  	}
  });
});