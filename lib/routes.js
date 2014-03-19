Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  waitOn: function () {
    if (Meteor.isClient) {
      var userData = Meteor.subscribe('userData');
      if (Meteor.user()) {
        var username = Meteor.users.findOne(Meteor.userId()).username;
        return [
          Meteor.subscribe('messages', this.params._id),
          userData,
          Meteor.subscribe('conversations', username),
          Meteor.subscribe('notifications')
        ];
      }
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