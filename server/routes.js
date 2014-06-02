var main = require('./main');

module.exports = function (app) {
	app.route('/').get(
		function(req, res) {
			res.send('Welcome!');
		}
	);
	app.route('/meetings').get(main.getLatestMeetings).post(main.generateMeetings);
	app.route('/members').get(main.getMembers);
	app.route('/statistics').get(main.getStats);
};