/**
 * Module dependencies.
 */
require('date-utils');
require('./db');

var mongoose = require('mongoose'),
	Chance = require('chance'),
	chance = new Chance(),
	async = require("async"),
	Meeting = mongoose.model('Meeting'),
	Member = mongoose.model('Member');

/**
 * Utils - get random int
 * @param min
 * @param max
 * @returns {*}
 */
var getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Utils - get random array element
 * @param arr
 * @param count
 * @returns {Array|string|*|Buffer|Blob|Query}
 */
var getRandomArrayElements = function (arr, count) {
	var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
	while (i-- > min) {
		index = Math.floor((i + 1) * Math.random());
		temp = shuffled[index];
		shuffled[index] = shuffled[i];
		shuffled[i] = temp;
	}
	return shuffled.slice(min);
};

/**
 * Get latest meetings
 * @param req
 * @param res
 */
exports.getLatestMeetings = function (req, res) {
	var today = new Date();

	Meeting.find({start: {$gte: today}})
		.sort({start: 'asc', end: 'desc'})
		.limit(5)
		.exec(function (e, r) {
			res.jsonp(r);
		});
};

/**
 * Generate dummy meetings
 * @param req
 * @param res
 */
exports.generateMeetings = function (req, res) {
	var settings = req.body.data || {},
		limit = settings.entries || 5000,
		generatedMeetings = [];

	Member.find().exec(function (e, r) {
		for (var i = 0; i < limit; i++) {
			var assignedMembers = getRandomArrayElements(r, getRandomInt(1, r.length - 1));
			var startDate = chance.date({year: new Date().getFullYear()}),
				endDate = startDate.clone().addHours(getRandomInt(1, 8));

			generatedMeetings.push({
				topic: settings.topic ? settings.topic + " " + i : chance.sentence({words: 4}),
				start: startDate,
				end: endDate,
				members: assignedMembers
			});
		}

		Meeting.create(generatedMeetings, function (e) {
			if (e) {
				return res.send(400, e);
			} else {
				res.jsonp({message: 'Success'});
			}
		});
	});
};

/**
 * Get members with the latest meeting
 * @param req
 * @param res
 */
exports.getMembers = function (req, res) {
	var today = new Date();
	var data = [];

	Member.find().sort({firstName: 'asc'}).exec(function (e, members) {
		async.each(members, function (item, callback) {
			Meeting.findOne({'members._id': item._id, start: {$gte: today}}).sort({start: 'asc', end: 'desc'}).exec(function (e, meeting) {
				data.push({
					details: item,
					meeting: meeting
				});
				callback();
			});
		}, function () {
			res.jsonp(data);
		});
	});
};

/**
 * Get statistics
 * @param req
 * @param res
 */
exports.getStats = function (req, res) {
	var ret = {
		totalMeetings: 0,
		totalMembers: 0,
		avgMembers: 0
	};
	Meeting.count(function (e, r) {
		ret.totalMeetings = r;
		Meeting.find({start: {$gte: new Date()}})
			.sort({start: 'asc', end: 'desc'})
			.limit(20)
			.select('members')
			.exec(function (e, meetings) {
				async.each(meetings, function (item, callback) {
					ret.totalMembers += item.members.length;
					callback();
				}, function () {
					ret.avgMembers = ret.totalMembers / 20;
					res.jsonp(ret);
				});
			});
	});
};