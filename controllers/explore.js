var User = require('../models/User');
var Job = require('../models/Job');

exports.exploreOne = function(req, res) {
  res.render('explore', {
    title: 'Find a job'
  });
};

exports.exploreTwo = function(req, res) {
	Job.find(function (err, joblist) {
		res.render('explore', {
			title : 'Find a job',
			jobs : [{
   					  "experience_level": "Fresher",
    				  "location": "San Jose",
  					  "skill_set": "Java",
  					  "job_id": "10001",
  					  "description": "Software Development Engineer",
  					  "job_title": "Software Engineer",
  					  "__v": 0
  					}]
		});
	});
};

exports.explore = function(req, res) {
	Job.find(function (err, joblist) {
		res.render('explore', {
			title : 'Find a job',
			jobs : joblist
		});
	});
};