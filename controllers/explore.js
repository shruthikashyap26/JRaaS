var User = require('../models/User');
var Job = require('../models/Job');
var secrets = require('../config/secrets');

exports.explore = function(req, res) {
	if(User.whoareyou == 'company') {
		req.flash('errors', {msg: 'Looks like an invalid url for your account.'});
    	return res.redirect('/');
    } else {
		state = req.query.state;
		if (undefined != state) {
			stateName = state.replace(/%20/g, " ");
		} else {
			stateName = "";
		}
		var sort = {'_id' : -1};
		Job.find({ location : new RegExp(stateName)}, function (err, joblist) {
			res.render('explore', {
				title : 'Find a job',
				jobs : joblist,
				fb : secrets.facebook,
				ln : secrets.linkedin
			});
		}).sort(sort);
 	}
};

exports.exploreByCompany = function(req, res) {
	if (req.user.whoareyou == 'company') {
		var sort = {'_id' : -1};
		Job.find({company_id : req.user.company.company_id}, function(err, joblist) {
			res.render('explore', {
				title : 'Jobs List', 
				jobs : joblist,
				fb : secrets.facebook,
				ln : secrets.linkedin,
				whoareyou : req.user.whoareyou
			});
		}).sort(sort);
	} else {
		req.flash('errors', {msg: 'Looks like an invalid url for your account.'});
		return res.redirect('/job');
	}
};