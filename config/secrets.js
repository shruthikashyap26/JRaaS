/**
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" API keys and passwords so
 * that all features could work out of the box.
 *
 * Use config vars (environment variables) below for production API keys
 * and passwords. Each PaaS (e.g. Heroku, Nodejitsu, OpenShift, Azure) has a way
 * for you to set it up from the dashboard.
 *
 * Another added benefit of this approach is that you can use two different
 * sets of keys for local development and production mode without making any
 * changes to the code.

 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 */

module.exports = {

  db: process.env.MONGODB || 'mongodb://cmpe295b:cmpe295b@ds037387.mongolab.com:37387/jraas_db',

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  mailgun: {
    user: process.env.MAILGUN_USER || 'postmaster@sandbox535179b61a1748bfb1cf956080cad851.mailgun.org',
    password: process.env.MAILGUN_PASSWORD || '37e301e17471adfa9b8a1a0c6ee15a3a'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '669400563172268',
    clientSecret: process.env.FACEBOOK_SECRET || 'b200141eb7bb77bc578c0388f36b73f8',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  github: {
    clientID: process.env.GITHUB_ID || 'f5e3203c3b4974a6d166',
    clientSecret: process.env.GITHUB_SECRET || '5c190c056c503062f910994d5078264706546ca3',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  google: {
    clientID: process.env.GOOGLE_ID || '840265510598-s0b06ps3aa4mvn1fkncqdhnjsrc4qq9p.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'Mcsos16wPlV3mhQjDB83f02f',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },

  linkedin: {
    clientID: process.env.LINKEDIN_ID || '78mttjus7iltv4',
    clientSecret: process.env.LINKEDIN_SECRET || 'OtrDPWi4fAIUW0tO',
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://jraas.elasticbeanstalk.com/auth/linkedin/callback',
    scope: ['r_fullprofile', 'r_emailaddress', 'r_network'],
    passReqToCallback: true
  }
 
};
