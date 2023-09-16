const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
    try {
        console.log(req.user._id);
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        return res.redirect('back');
    } catch (err) {
        console.log('error in creating a post', err);
        return res.status(500).send('Internal Server Error');
    }
};


module.exports.destroy = async function (req, res) {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.redirect('back'); // Post not found
      }
      //when you are comparing it must be String
      if (post.user.toString() == req.user.id.toString()) {
        console.log(post);
        await post.deleteOne();
        await Comment.deleteMany({ post: req.params.id });
      } else {
        return res.redirect('back'); // User doesn't have permission
      }
  
      return res.redirect('back'); // Successfully deleted, or user didn't have permission
    } catch (err) {
      console.error(err);
      return res.redirect('back'); // Handle errors gracefully
    }
  };
  
