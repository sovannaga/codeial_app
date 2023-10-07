const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function (req, res) {
    // try {
    //     // console.log(req.cookies);
    //     // res.cookie('user_id', 25);
    //     const posts = await Post.find({});
    //     console.log(posts);
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // } catch (err) {
    //     console.log('Error in fetching posts', err);
    //     return res.status(500).send('Internal Server Error');
    // }

    //populate the user of each post
    try {
        const posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path:'user'
            }
        })
        .exec();

        //Retrieve all users
        const users = await User.find({}).exec()
        res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
    } catch (err) {
        // Handle any errors here
        console.error(err);
        // Send an error response
        res.status(500).send('Internal Server Error');
    }
    
};

//module.exports.actionName = async function(req, res){}
