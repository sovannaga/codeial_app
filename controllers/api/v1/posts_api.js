const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
module.exports.index = async function(req, res){

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

    return res.json(200,{
        message: "List of Posts",
        posts: posts
    })
}

module.exports.destroy = async function (req, res) {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.redirect('back'); // Post not found
      }
      // when you are comparing it must be String and .id means converting the object id into string
      if (post.user == req.user.id) {
        await post.deleteOne();

        await Comment.deleteMany({ post: req.params.id });

        return res.json(200, {
          message: "Post and Associated comments deleted successfully"
        }); // Successfully deleted, or user didn't have permission
      }else{
        return res.json(401, {
          message: "You cannot delete this post! "
        }); 
      }

    } catch (err) {
        console.log('******', err);
        return res.json(500, {
          message: "Internal Server Error",
        });
    }
  }