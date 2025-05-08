const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  content: {
    type: String,
    required: true,
  },

  author: {
    type: String, 
    required: true,
  },

  datePublished: {
    type: Date,
    required: true,
  },

  continent: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  coverImageUrl: {
    type: String, 
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now, // timestamp when added to the DB
  },
});

// Optional index for sorting by date added
ArticleSchema.index({ createdAt: -1 });

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;
