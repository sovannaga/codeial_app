const User = require('../medels/user');

module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: "User_Profile"
    });
}

//render the sign up page
module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: "codeial | Sign Up"
    })
}

//render the sign in apge
module.exports.signIn = function(req, res){
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
    //To do later
}