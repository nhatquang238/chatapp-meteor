var signedIn = function (userId, doc) {
  return !! userId;
};

Messages.allow({
  insert: signedIn,
  update: signedIn,
  remove: signedIn
});

// only allow access to conversations collection if signed in
Conversations.allow({
	insert: signedIn
});