Messages.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});

Conversations.allow({
	insert: function (userId, doc) {
		return !! userId;
	}
});