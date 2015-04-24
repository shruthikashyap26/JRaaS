var secrets = require('../config/secrets');
var Job = require('../models/Job');

/**
 * GET /job
 * Job form page.s
 */
exports.getJob = function(req, res) {
  //if (req.body.whoareyou == 'company') {
    res.render('job', {
      title: 'Job'
    });
 // } else {
 //   req.flash('errors', {msg: 'You need to sign in as a company to post jobs.'});
 //   return res.redirect('/');
 // }
};

/**
 * POST /job
 * Create a new job.
 */
exports.postJob = function(req, res, next) {
 // if (req.body.whoareyou == 'company') {
    req.assert('job_title', 'Job tittle cannot be blank').notEmpty();
    req.assert('job_id', 'Job ID is not valid').notEmpty();
    req.assert('skill_set', 'Skill is not valid').notEmpty();
    req.assert('location', 'Location is not valid').notEmpty();
  
    var errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/job');
    }

    var job = new Job({
      job_title: req.body.job_title,
      description: req.body.description,
      job_id: req.body.job_id,
      skill_set: req.body.skill_set,
      location: req.body.location,
      experience_level: req.body.experience_level
    });

    job.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Job has been posted Successfully.' });
      res.redirect('/job');
    });
//  }
};

exports.viewJob = function(req, res) {
  var jobId = req.query.jobid;
  var query = {};
  query['job_id'] = jobId;
  Job.findOne(query, function(err, job) {
    res.render('viewjob', {
      title : 'Check it out',
      job : job
    })
  });
}