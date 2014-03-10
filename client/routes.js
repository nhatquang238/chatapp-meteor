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
  	path: '/conversations/:_id',
  	template: 'chat',
  	yieldTemplates: {
  		'messages': {to: 'messages'}
  	},
    data: function () {
      console.log(this.params._id);
      return  Meteor.subscribe('messages', {conversationId: this.params._id});
    },
    after: function () {
      // this.render();
      var dist = $('.messages').height()-$('.main-container').height();
      console.log('load after routing ' + dist);
      $('.main-container').scrollTop(dist);
      dist = null;
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
Router.before(function () {
  clearError();
});