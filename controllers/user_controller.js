const User = require('../models/user');
const path = require('path');
const fs = require('fs');

// let's keep it same as before

module.exports.profile = async function(req, res) {
    try {
      const user = await User.findById(req.params.id);
      res.render('user_profile', {
        title: 'User Profile',
        profile_user: user
      });
    } catch (err) {
      // Handle errors here, for example, you can send an error response or render an error page.
      console.error(err);
      // Handle the error accordingly, for example:
      req.flash('error', 'User not found');
      return res.redirect('back');
    }
  };    


module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     });
    // }else{
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }
    if(req.user.id == req.params.id){
      try{
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req, res, function(err){
          if(err){console.log('***Multer Error: ', err)}

          user.name = req.body.name;
          user.email = req.body.email;

          if (req.file) {

            if (user.avatar) {
             const avatarPath = (path.join(__dirname, '..', user.avatar));
              //  jab avatar already exists
              if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
              }
            }

            //This is saving the path of the uploaded file into the avatar field in the user
            user.avatar = User.avatarPath + '/' + req.file.filename;
         }
         user.save();
         return res.redirect('back');
        })

      }catch(err){
        req.flash('error', err);
        return res.redirect('back');
      }
    }else{
      req.flash('error', 'Unauthorized!');
      return res.status(401).send('Unauthorized');
    }
}


// render the sign up page
module.exports.signUp = async function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/profile');
  }

  try {
    res.render('user_sign_up', {
      title: "Codeial | Sign Up"
    });
  } catch (err) {
    // Handle errors here, for example, you can send an error response or render an error page.
    console.error(err);
    // Handle the error accordingly, for example:
    req.flash('error', 'An error occurred while rendering the sign-up page');
    return res.redirect('back');
  }
};



// render the sign in page
module.exports.signIn = async function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/profile');
  }

  try {
    res.render('user_sign_in', {
      title: "Codeial | Sign In"
    });
  } catch (err) {
    // Handle errors here, for example, you can send an error response or render an error page.
    console.error(err);
    // Handle the error accordingly, for example:
    req.flash('error', 'An error occurred while rendering the sign-in page');
    return res.redirect('back');
  }
};


// get the sign up data
module.exports.create = async function(req, res) {
    try {
      if (req.body.password !== req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
      }
  
      const existingUser = await User.findOne({ email: req.body.email });
      if (!existingUser) {
        const user = await User.create(req.body);
        req.flash('success', 'You have signed up, login to continue!');
        return res.redirect('/users/sign-in');
      } else {
        req.flash('success', 'You have signed up, login to continue!');
        return res.redirect('back');
      }
    } catch (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
  };


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
     if (err) {
        console.error('errors while logout', err);
     }
     req.flash('success', 'You have Logged out');
     return res.redirect('/');
  });
}