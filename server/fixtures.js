if (Meteor.users.find().count() === 0) {
	Accounts.createUser({
		username: 'nobita',
		password: 'foofoobar'
	});

	Accounts.createUser({
		username: 'doraemon',
		password: 'foofoobar'
	});

	Accounts.createUser({
		username: 'xuka',
		password: 'foofoobar'
	});

	Accounts.createUser({
		username: 'xeko',
		password: 'foofoobar'
	});

	Accounts.createUser({
		username: 'chaien',
		password: 'foofoobar'
	});
}