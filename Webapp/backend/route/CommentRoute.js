const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');
const Allowstaff = require('../middleware/authentication');

// POST: Add a new comment
router.post('/add', Allowstaff({ allowOwner: true, allowZeus: true, allowUser: true}), commentController.addComment);

// GET: Get all comments for a specific article
router.get('/article/:articleId', commentController.getCommentsByArticle);

// DELETE: Delete comment by ID
router.delete('/:id', commentController.deleteCommentById);

module.exports = router;
