const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.create = async function(req, res) {
    try {
      const post = await Post.findById(req.body.post);
      
        if (post) {
          const comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
          });
    
          post.comments.push(comment);
          await post.save();
    
          res.redirect('/');
        }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }


  module.exports.destroy = async function (req, res) {
    try {
      const comment = await Comment.findById(req.params.id);
  
      if (!comment) {
        return res.redirect('back'); // Comment not found
      }
      //when you are comparing it must be String and .id means converting the object id into string
      if (comment.user ==  req.user.id) {
        const postId = comment.post;
        console.log(comment);
        await comment.deleteOne();
  
        const post = await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
  
        return res.redirect('back');
      } else {
        return res.redirect('back'); // User doesn't have permission
      }
    } catch (err) {
      console.error(err);
      return res.redirect('back'); // Handle errors gracefully
    }
  };
  
