const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


//tell passport to use a new strategy for google log in
passport.use(new googleStrategy({
        clientID: "613222634332-728vndl5cetpcoolmqglmqnpqnkv37ga.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },

    async (accessToken, refreshToken, profile, done) => {
        try {
            //find a user
            const user = await User.findOne({ email: profile.emails[0].value }).exec();
    
            console.log(profile);
    
          if (user) {
            //if found, set this user as req.user
            return done(null, user);
          } else {
            //if not found, create the user and set it as req.user
            const newUser = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString('hex'),
            });
            return done(null, newUser);
          }
        } catch (err) {
            console.log('Error in Google Strategy-Passport', err);
            return done(err);
        }
      }

));


module.exports = passport;