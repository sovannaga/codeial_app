const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(
    new LocalStrategy(
      {
        usernameField: 'email'
      },
      async function (email, password, done) {
        try {
          // Find a user and establish the identity
          const user = await User.findOne({ email: email });
  
          if (!user || user.password != password) {
            console.log('Invalid Username/password');
            return done(null, false);
          }
  
          return done(null, user);
        } catch (err) {
          console.log('Error in finding user --> passport');
          return done(err);
        }
      }
));

//serializing the user to decided which key is to be kept in the cookie
passport.serializeUser( async function(user, done){
    done(null, user.id);

});

    
//deserializing the user from the key in the cookie
passport.deserializeUser(async function (id, done) {
    try {
      // Find the user if it exists
      const user = await User.findById(id);
    
      //if the user not found
      if (!user) {
        console.log('User not found --> passport');
        return done(null, false);
      }
      
      //if the user found
      return done(null, user);
    } catch (err) {
      console.log('Error in finding user --> passport');
      return done(err);
    }
  });

  //check if the user is authenticated
  passport.checkAuthentication = async function (req, res, next) {
    try {
      // Check if the user is signed in, then pass on the request to the next function(controller's action)
      if (req.isAuthenticated()) {
        return next();
      } else {
        // If the user is not signed in, redirect to the sign-in page
        return res.redirect('/users/sign-in');
      }
    } catch (error) {
      // Handle any errors that occur during the authentication check
      console.error('Error in checkAuthentication:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  

passport.setAuthenticatedUser = async function(req, res, next){
  try{
    if(req.isAuthenticated){
      //req.user contains the current signed in user from the session cookie and we are just 
      //sending this to the locals for the views
      res.locals.user = req.user;
    }
  
    next();
  }catch(err){
    next(err);
  }
}

  //we need to export the passport
  module.exports = passport;