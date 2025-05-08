const express = require('express');
const router = express.Router();
const articleController = require('../controllers/ArticleController');

// CREATE
router.post('/', articleController.createArticle);

// GET (optionally filtered)
router.get('/', articleController.getArticles);

// UPDATE
router.put('/:id', articleController.updateArticle);

// DELETE
router.delete('/:id', articleController.deleteArticle);

// GET an article by ID
router.get('/:id', articleController.getArticleById);


module.exports = router;
