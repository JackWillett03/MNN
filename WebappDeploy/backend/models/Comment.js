const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  // Reference to the User who made the comment
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Refers to the User model
    required: true
  },

  // Reference to the Article the comment is associated with
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article', // Refers to the Article model
    required: true
  },

  // The content of the comment
  comment: {
    type: String,
    required: true,
    trim: true,
  },

  // Timestamp when the comment was created
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current timestamp
  },
});

// Optional index for sorting by createdAt (latest comments first)
CommentSchema.index({ createdAt: -1 });

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
