if (Messages.find().count() === 0) {
	Messages.insert({
		from: "Ace",
		to: "Shawn",
		content: "Hello Shawn",
		time_sent: Date.now(),
		read: 0
	});

	Messages.insert({
		from: "Shawn",
		to: "Ace",
		content: "Hi Ace",
		time_sent: Date.now() + 1000,
		read: 0
	});

	Messages.insert({
		from: "Ace",
		to: "Shawn",
		content: "Mind helping me with Meteor?",
		time_sent: Date.now() + 2000,
		read: 0
	});
}