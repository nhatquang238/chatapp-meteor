Template.errors.helpers({
	errors: function () {
		return Errors.find();
	}
});

// this fucking rendered cb is gonna called twice
// don't dare putting any sensitve code in here
// e.g: GA code, alert
Template.errors.rendered = function () {
	var error = this.data;
	Meteor.defer(function () {
		Errors.update(error._id, {$set: {seen: true}});
	});
}

