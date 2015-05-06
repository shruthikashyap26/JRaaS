var User = require('../models/User');
var Job = require('../models/Job');
var secrets = require('../config/secrets');
var cosine = require('cosine');

function getCandidateDetailsAsString(user) {
	var profilesummary = user.profilesummary.title + " " + user.profilesummary.specialization + " " + user.profilesummary.skills
							+ " " + user.profilesummary.location;

	var workdetails = "";

	for (var i = 0; i < user.workdetails.work.length; i++) {
		workdetails += user.workdetails.work[i].job_title + " " + user.workdetails.work[i].role;
	}

	var schooldetails = "";

	for (var i = 0; i < user.schooldetails.education.length; i++) {
		schooldetails += user.schooldetails.education[i].school + " " + user.schooldetails.education[i].field + " " + user.schooldetails.education[i].degree;
	}

	var candidatedetails = profilesummary + workdetails + schooldetails;

	return candidatedetails;
}

exports.explore = function(req, res) {
	if(undefined != req.user && req.user.whoareyou == 'company') {
		req.flash('errors', {msg: 'Looks like an invalid url for your account.'});
    	return res.redirect('/exploreByCompany');
    } else if (undefined != req.user && req.user.whoareyou == 'candidate') {
    	var candidatedetails = getCandidateDetailsAsString(req.user);
    	state = req.query.state;
		if (undefined != state) {
			stateName = state.replace(/%20/g, " ");
		} else {
			stateName = "";
		}
		
		Job.find({ location : new RegExp(stateName, 'i')}, function (err, joblist) {
			if (joblist.length == 0) {
				req.flash("info", {msg: "No jobs currently in the selected region"});
				return res.redirect("/");
			}
			var matchedjoblist = [];
			var jobString = [];
			for (var i = 0; i < joblist.length; i++) {
				var stringedJob = joblist[i].job_title + " " + joblist[i].description + " " + joblist[i].skill_set + " " + joblist[i].location + " " + joblist[i].experience_level;
				var cosineValue = cosine(candidatedetails.split(/\s/), stringedJob.split(/\s/));
				console.log("Cosine Value for job id: " + joblist[i].job_id + " is " + cosineValue);
				if (Math.round(cosineValue * 100) > Math.round(0.5 * 100)) {
					matchedjoblist.push({job_id: joblist[i].job_id, company_id: joblist[i].company_id, job_title: joblist[i].job_title, 
						skill_set: joblist[i].skill_set, description: joblist[i].description, location: joblist[i].location,
						experience_level: joblist[i].experience_level});
				}
			}

			res.render('explore', {
				title : 'Find a job',
				jobs : matchedjoblist,
				fb : secrets.facebook,
				ln : secrets.linkedin,
				whoareyou : req.user.whoareyou
			});
		});
    } else {
		state = req.query.state;
		if (undefined != state) {
			stateName = state.replace(/%20/g, " ");
		} else {
			stateName = "";
		}
		var sort = {'_id' : -1};
		Job.find({ location : new RegExp(stateName, 'i')}, function (err, joblist) {
			if (joblist.length == 0) {
				req.flash("info", {msg: "No jobs currently in the selected region"});
				return res.redirect("/");
			}
			//console.log(joblist);
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
	if (undefined != req.user && req.user.whoareyou == 'company') {
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