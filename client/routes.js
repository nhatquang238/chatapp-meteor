Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('chat', {
    path: '/',
    template: 'chat'
  });
});

