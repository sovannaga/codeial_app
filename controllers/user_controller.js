const User = require('../models/user');

module.exports.profile = async function(req, res){
    try {
        const user = await User.findById(req.params.id);
        return res.render('user_profile', {
            title: "User_Profile",
            profile_user: user
        });
    } catch (err) {
        // Handle any errors here
        console.error(err);
        // Send an error response
        res.status(500).send('Internal Server Error');
    }
}

module.exports.update = async function (req, res) {
    try {
        if (req.user.id == req.params.id) {
            const user = await User.findByIdAndUpdate(req.params.id, { name: req.body.name, email: req.body.email });
            return res.redirect('back');
        } else {
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
}



//render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "codeial | Sign Up"
    })
}

//render the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "codeial | Sign In"
    })

}

//get the sign up data
module.exports.create = async function(req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {
            return res.redirect('back');
        }

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            const newUser = await User.create(req.body);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.error('Error in finding user in signing up:', err);
        return res.status(500).send('Internal Server Error'); // You may want to handle errors differently
    }
}

//sign in and create a session for the user 
module.exports.createSession = async function(req, res){
    req.flash('success', 'Logged in Successfully');  
    return res.redirect('/');
}

//sign out an destroy the session
module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
      if (err) {
        console.error(err);
      }

    req.flash('success', 'You Have Logged Out Successfully');
    res.redirect('/');
    });
}
  
  