var mongoose = require('mongoose'),
	Chance = require('chance'),
	chance = new Chance(),
	Schema = mongoose.Schema;

var MemberSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String
});

var MeetingSchema = new Schema({
	topic: {
		type: String,
		default: '',
		trim: true,
		required: 'Topic cannot be blank'
	},
	start: {
		type: Date,
		default: Date.now,
		required: 'Start date cannot be blank'
	},
	end: {
		type: Date,
		required: 'End date cannot be blank'
	},
	members: {
		type: [MemberSchema]
		//ref: 'Member'
	}
});

mongoose.model('Member', MemberSchema);
mongoose.model('Meeting', MeetingSchema);

// Initial members
var MemberModel = mongoose.model('Member');
MemberModel.count(function (e, r) {
	if (r === 0) {
		var members = [];
		for (var i = 0; i < 10; i++) {
			members.push({
				firstName: chance.first(),
				lastName: chance.last(),
				email: chance.email()
			});
		}
		MemberModel.create(members);
	}
});

mongoose.connect('mongodb://localhost/ilumy-meetings');