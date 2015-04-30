var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var shortid = require('shortid');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  whoareyou: String,
  
  facebook: String,
  google: String,
  github: String,
  linkedin: String,
  tokens: Array,

  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  },

  profilesummary: {
    title: {type: String, default:''},
    specialization: {type: String, default:''},
    skills: {type: String, default:''},
    location: {type: String, default:''},
    search: {type: String, default:''}
  },

  workdetails: {
    work : [ {
      company_name: {type: String, default:''},
      job_title: {type: String, default:''},
      role: {type: String, default:''} 
    } ]
  },

  schooldetails: {
    education : [ {
      school: {type: String, default:''},
      field:  {type: String, default:''},
      degree: {type: String, default:''},
      start_year: {type: String, default:''},
      end_year: {type: String, default:''}
    } ]
  },
  
  company: {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    contact_email: { type: String, default: '' },
    company_id: { type: String, default: '' }
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function(size) {
  if (!size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', userSchema);
