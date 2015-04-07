var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');
/**
 * GET /profilesummary
 * Profile form page.
 */
exports.getProfile = function(req, res) {
  res.render('candidate/profilesummary', {
    title: 'Profile'
  });
};
/**
 * POST /profilesummary
 * Profile form page.
 */
exports.postProfile = function(req, res) {
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    user.profilesummary.title = req.body.title || '';
    user.profilesummary.specialization = req.body.specialization || '';
    user.profilesummary.skills = req.body.skills || '';
    user.profilesummary.location = req.body.location || '';
    user.profilesummary.search = req.body.search || '';

    user.save(function(err) {
      if (err) return next(err);
      res.redirect('/workdetails');
    });
 });
};
  /**
 * GET /workdetails
 * Profile form page.
 */
exports.getWorkDetails = function(req, res) {
  res.render('candidate/workdetails', {
    title: 'Profile'
  });
};
/**
 * POST /workdetails
 * Profile form page.
 */
exports.postWorkDetails = function(req, res) {
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    user.workdetails.company_name = req.body.company_name || '';
    user.workdetails.job_title = req.body.job_title || '';
    user.workdetails.role = req.body.role || '';

    user.save(function(err) {
      if (err) return next(err);
  	   res.redirect('/edudetails');
    });
 });
};
  /**
 * GET /edudetails
 * Profile form page.
 */
exports.getEduDetails = function(req, res) {
  res.render('candidate/edudetails', {
    title: 'Profile'
  });
};
/**
 * POST /edudetails
 * Profile form page.
 */
exports.postEduDetails = function(req, res) {
  	User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    user.edudetails.school = req.body.school || '';
    user.edudetails.field = req.body.field || '';
    user.edudetails.degree = req.body.degree || '';
    user.edudetails.start_year = req.body.start_year || '';
    user.edudetails.end_year = req.body.end_year || '';

    user.save(function(err) {
      if (err) return next(err);
       res.redirect('/extradetails');
    });
 });
};
 /**
 * GET /extradetails
 * Profile form page.
 */
exports.getExtraDetails = function(req, res) {
  res.render('candidate/extradetails', {
    title: 'Profile'
  });
};