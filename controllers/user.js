var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = function(req, res) {
  if (undefined != req.user && req.user.whoareyou == 'candidate') {
    return res.redirect('/');
  } else if (undefined != req.user && req.user.whoareyou == 'company') {
    return res.redirect('/exploreByCompany');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Success! You are logged in.' });
      if (user.whoareyou == 'candidate')
        res.redirect(req.session.returnTo || '/');
      else if (user.whoareyou == 'company')
        res.redirect(req.session.returnTo || '/exploreByCompany');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password,
    whoareyou: req.body.whoareyou
  });

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save(function(err) {
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);
        if (user.whoareyou == 'candidate')
          res.redirect('/profileSummary');
        else if (user.whoareyou == 'company')
          res.redirect('/company');
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function(req, res) {
  User.findById(req.user.id, function(err,user) {
    if (err) return next(err);
    if( User.findById(req.user.whoareyou) == "candidate") { 
      res.render('account/profile', {
      title: 'Account Management'
      });
    }
    else {
      res.render('account/profile', {
    title: 'Account Management'
  });
    }
  });
};



/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';

    console.log("the whoareyou is " + req.body.whoareu);
    if (req.body.whoareu == "candidate" ) 
    {
      user.profile.website = req.body.website || '';

      user.profilesummary.title = req.body.email || '';
      user.profilesummary.skills = req.body.skills || '';
      user.profilesummary.specialization = req.body.specialization || '';
      user.profilesummary.location = req.body.location || '';

      if(req.body.workCount == 0) 
      {
        console.log("sneha here");
        //user.update({"email": req.body.email}, user.workdetails: {$exists: true}}, 
          //        {$set: {user.workdetails: []}}))
        User.findOneAndUpdate({"email": req.body.email} , {$pull : { "workdetails.work": {}}},function(err,place){console.log("error updating")});
        user.workdetails.work.push({
          company_name : "none" , job_title : "none" , role : "none"});
      }

      else if(req.body.workCount  == 1) 
      {
              User.findOneAndUpdate({"email": req.body.email} , {$pull : { "workdetails.work": {}}},function(err,place){console.log("error updating")});
         user.workdetails.work.push({ 
            company_name : req.body.company_name ,job_title : req.body.job_title ,role : req.body.role }); 
      }
      else 
      {
        for (var  i=0; i< req.body.workCount; i++)
        {
          if(req.body.company_name[i] != '' && req.body.job_title[i] != '' && req.body.role[i] != '') 
          {
                  User.findOneAndUpdate({"email": req.body.email} , {$pull : { "workdetails.work": {}}},function(err,place){console.log("error updating")});
            user.workdetails.work.push({ 
              company_name : req.body.company_name[i] ,job_title : req.body.job_title[i] ,role : req.body.role[i]  
            });
          }  
        }
      } 

      if(req.body.schoolCount == 0) 
      {
        console.log("sneha school here");
        //user.update({"email": req.body.email}, user.workdetails: {$exists: true}}, 
          //        {$set: {user.workdetails: []}}))
        User.findOneAndUpdate({"email": req.body.email} , {$pull : { "schooldetails.education": {}}},function(err,place){console.log("error updating")});
        user.schooldetails.education.push({
          school : "none"  ,field : "none"  ,degree : "none"  , start_year : "none"  , end_year : "none" }); 
      }

      else if(req.body.schoolCount  == 1) 
      {
        User.findOneAndUpdate({"email": req.body.email} , {$pull : { "schooldetails.education": {}}},function(err,place){console.log("error updating")});
         user.schooldetails.education.push({ 
            school : req.body.school ,field : req.body.field ,degree : req.body.degree , start_year : req.body.start_year , end_year : req.body.end_year }); 
      }
      else 
      {
        for (var  i=0; i< req.body.schoolCount; i++)
        {
          if(req.body.school[i] != '' &&  (req.body.field[i] != '' || req.body.degree[i] != '') )
          {
            User.findOneAndUpdate({"email": req.body.email} , {$pull : { "schooldetails.education": {}}},function(err,place){console.log("error updating")});
            user.schooldetails.education.push({
              school : req.body.school[i] ,field : req.body.field[i] ,degree : req.body.degree[i] , start_year : req.body.start_year[i] , end_year : req.body.end_year[i]   
            });
          }  
        }
      } 
    }
    else if ( req.body.whoareu == "company" ) 
    {
      user.company.name = req.body.company_name;
      user.company.description  = req.body.description;
      user.company.website = req.body.website;
      user.company.address =req.body.address;
      user.company.phone = req.body.phone;
      user.company.contact_email = req.body.contact_email;
    }

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Profile information updated.' });
      res.redirect('/Account');
    });
  });
};
/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user.password = req.body.password;

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    if (err) return next(err);
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });

    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ resetPasswordToken: req.params.token })
    .where('resetPasswordExpires').gt(Date.now())
    .exec(function(err, user) {
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }

          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            if (err) return next(err);
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'MailGun',
        auth: {
          user: secrets.mailgun.user,
          pass: secrets.mailgun.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'admin@jraasinc.com',
        subject: 'Your JRaaS Account password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
        done(err);
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function(req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
        if (!user) {
          req.flash('errors', { msg: 'No account with that email address exists.' });
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'MailGun',
        auth: {
          user: secrets.mailgun.user,
          pass: secrets.mailgun.password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'admin@jraasinc.com',
        subject: 'Reset your password on JRaaS.com',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};