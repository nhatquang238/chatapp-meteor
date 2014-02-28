Template.userPill.labelClass = function () {
	if (this._id === Meteor.userId()) {
		return "label-warning";
	} else if (this.profile.online === true) {
		return "label-success";
	} else {
		return "";
	}
}