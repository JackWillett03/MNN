const Comment = require('../models/Comment');
const User = require('../models/User');
const Article = require('../models/Article');

// Add a new comment
exports.addComment = async (req, res) => {
  try {
    const { username, articleId, commentContent } = req.body;

    // Find user and article
    const user = await User.findOne({ Username: username });
    const article = await Article.findById(articleId);

    if (!user || !article) {
      return res.status(404).json({ message: 'User or Article not found' });
    }

    // Create and save new comment
    const newComment = new Comment({
      user: user._id,
      article: article._id,
      comment: commentContent,
    });

    await newComment.save();

    // Populate the returned comment
    await newComment.populate('user', 'Username');

    res.status(200).json({ newComment });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// Get all comments for an article
exports.getCommentsByArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    const comments = await Comment.find({ article: articleId })
      .populate('user', 'Username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving comments', error: error.message });
  }
};

// Delete a comment by ID
exports.deleteCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};
