var User = require('../models/User');
var Job = require('../models/Job');

exports.explore = function(req, res) {
	state = req.query.state;
	if (undefined != state) {
		stateName = state.replace(/%20/g, " ");
	} else {
		stateName = "";
	}

	Job.find({ location : new RegExp(stateName)}, function (err, joblist) {
		res.render('explore', {
			title : 'Find a job',
			jobs : joblist
		});
	});
};