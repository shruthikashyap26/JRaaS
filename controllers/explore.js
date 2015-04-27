var User = require('../models/User');
var Job = require('../models/Job');
var secrets = require('../config/secrets');

exports.explore = function(req, res) {
	state = req.query.state;
	if (undefined != state) {
		stateName = state.replace(/%20/g, " ");
	} else {
		stateName = "";
	}

	//if (!req.user) {
		Job.find({ location : new RegExp(stateName)}, function (err, joblist) {
			res.render('explore', {
				title : 'Find a job',
				jobs : joblist,
				fb : secrets.facebook,
				ln : secrets.linkedin
			});
		});
	//} else if (req.user.whoareyou == 'company') {
	//	return res.redirect('/job');
	//} else {
	//	return res.redirect('/profilesummary');
	//}
};