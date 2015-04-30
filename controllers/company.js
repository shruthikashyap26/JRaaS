var secrets = require('../config/secrets');
var User = require('../models/User');
var shortid = require('shortid');

/**
 * GET /company
 * Company form page.
 */
exports.getCompany = function(req, res) {
  if(undefined != req.user && req.user.whoareyou == 'candidate') {
    req.flash('errors', {msg: 'Looks like an invalid url for your account.'});
      return res.redirect('/');
  } else {
    res.render('company', {
      title: 'Company'
    });
  }
};

/**
 * POST /company
 * Create a new company.
 */
exports.postCompany = function(req, res) {
  req.assert('company_name', 'Name cannot be blank').notEmpty();
  req.assert('contact_email', 'Email is not valid').isEmail();
  
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/company');
  }

  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user.company.name = req.body.company_name;
    user.company.description = req.body.description;
    user.company.website = req.body.website;
    user.company.address = req.body.address;
    user.company.phone = req.body.phone;
    user.company.contact_email = req.body.contact_email;
    user.company.company_id = shortid.generate();

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Company information saved.' });
      res.redirect('/job');
    });
  });
};