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
  this.route('conversations', {
  	path: '/conversations/:members',
  	template: 'chat',
  	yieldTemplates: {
  		'messages': {to: 'messages'}
  	},
    after: function () {
      // this.render();
      $('.message-preview').first().click();
    }
  });
});

var requiredLogin = function () {
  if (!Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render('loading');
    } else {
      this.render('accessDenied');
    }
    this.stop();
  }
}

Router.before(requiredLogin);