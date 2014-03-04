Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  waitOn: function () {
  	// return [Meteor.subscribe('messages'), Meteor.subscribe('userData')];
    return Meteor.subscribe('userData');
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

var requiredLogin = function () {
  if (!Meteor.user()) {
    this.render('accessDenied');
    this.stop();
  }
}

Router.before(requiredLogin);