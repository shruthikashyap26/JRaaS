var User = require('../models/User');
var Job = require('../models/Job');

exports.explore = function(req, res) {
	state = req.params('state');
	stateName = state.replace(/%20/g, " ");
	if (stateName == 'undefined') {
		stateName = "";
	}
	Job.find({ location : '/^stateName$/i'}, function (err, joblist) {
		res.render('explore', {
			title : 'Find a job',
			jobs : joblist
		});
	});
};