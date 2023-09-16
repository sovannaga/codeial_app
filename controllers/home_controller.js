const Post = require('../models/post');

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
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path:'user'
            }
        })
        .exec();
        res.render('home', {
            title: "Codeial | Home",
            posts: posts
        });
    } catch (err) {
        // Handle any errors here
        console.error(err);
        // Send an error response
        res.status(500).send('Internal Server Error');
    }
    
};

//module.exports.actionName = async function(req, res){}
