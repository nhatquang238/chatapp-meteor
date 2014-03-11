Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  waitOn: function () {
    if (Meteor.isClient) {
    	return [Meteor.subscribe('messages', this.params._id), Meteor.subscribe('userData'), Meteor.subscribe('conversations')];
      // return Meteor.subscribe('userData');
    }
  }
});

Router.map(function() {
  this.route('chat', {
    path: '/',
    template: 'chat',
    fastRender: true,
    yieldTemplates: {
      'messages': {to: 'messages'}
    }
  });
  this.route('newConversation', {
  	path: '/new',
  	template: 'chat',
    fastRender: true,
  	yieldTemplates: {
  		'newMessage': {to: 'newMessage'}
  	}
  });
  this.route('conversations', {
  	path: '/conversations/:_id',
  	template: 'chat',
    fastRender: true,
  	yieldTemplates: {
  		'messages': {to: 'messages'}
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
Router.before(function () {
  clearError();
});