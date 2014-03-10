Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  waitOn: function () {
  	return [Meteor.subscribe('messages', this.params._id), Meteor.subscribe('userData')];
    // return Meteor.subscribe('userData');
  }
});

Router.map(function() {
  this.route('chat', {
    path: '/',
    template: 'chat',
    yieldTemplates: {
      'messages': {to: 'messages'}
    },
    data: {
      messagePreviews: function () {
        var messagePreviews = Conversations.find().fetch();
        var currentUser = Meteor.user().username;

        for (var i = 0; i < messagePreviews.length; i++) {
          var index = messagePreviews[i].members.indexOf(currentUser);
          messagePreviews[i].members.splice(index, 1);
        };

        return messagePreviews;
      }
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
  	path: '/conversations/:_id',
  	template: 'chat',
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