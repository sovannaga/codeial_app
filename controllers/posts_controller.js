const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
    try {
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            return res.status(200).json({
              data: {
                post: post
              },
              message: "Post created!"
            });
        }

        req.flash('success', 'Post Published!');
        return res.redirect('back');
    } catch (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
};


module.exports.destroy = async function (req, res) {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.redirect('back'); // Post not found
      }
      //when you are comparing it must be String and .id means converting the object id into string
      if (post.user == req.user.id) {
        await post.deleteOne();

        await Comment.deleteMany({ post: req.params.id });

        if(req.xhr){
          return res.status(200).json({
            data: {
              post_id: req.params.id
            },
            message: "post deleted"
          })
        }

        req.flash('success', 'Post and associated comments Deleted!')
      } else {
        req.flash('error', 'You Cannit Delete this Post!')
        return res.redirect('back'); // User doesn't have permission
      }
  
      return res.redirect('back'); // Successfully deleted, or user didn't have permission
    } catch (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
  }
  
