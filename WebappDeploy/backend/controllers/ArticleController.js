const Article = require('../models/Article');

// CREATE a new article
exports.createArticle = async (req, res) => {
  try {
    const { title, content, datePublished, continent, country, coverImageUrl, author } = req.body;

    // Ensure continent is valid
    const validContinents = ["Europe", "North America", "South America", "Asia", "Oceania", "Africa"];
    if (!validContinents.includes(continent)) {
      return res.status(400).json({ message: 'Invalid continent. Valid options are: Europe, North America, South America, Asia, Oceania, Africa.' });
    }

    // If author is not provided, use 'Unknown' as a default value
    const articleAuthor = author || 'Unknown'; 

    // Create the new article
    const newArticle = new Article({
      title,
      content,
      author: articleAuthor, // Use the provided author, or 'Unknown' if not provided
      datePublished: datePublished || new Date(), // Use provided date or current date if not provided
      continent,
      country,
      coverImageUrl,
    });

    // Save the article to the database
    await newArticle.save();

    // Emit an event after the article is created
    req.io.emit("articleCreated", newArticle);

    res.status(201).json(newArticle); // Return the created article
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating article', error: err.message });
  }
};


// GET all articles or filtered based on search
exports.getArticles = async (req, res) => {
  try {
    const query = {};
    const { country, continent, author, title } = req.query;

    // Add filters to the query
    if (country) query.country = country;
    if (continent) query.continent = continent;
    if (author) query.author = author;
    if (title) query.title = new RegExp(title, 'i'); // Case-insensitive search

    const articles = await Article.find(query).sort({ createdAt: -1 }); // Sort articles by creation date descending
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving articles', error: err.message });
  }
};

// GET an article by ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params; // Get the article ID from the URL
    const article = await Article.findById(id); // Find the article by ID

    if (!article) {
      return res.status(404).json({ message: 'Article not found' }); // Return error if not found
    }

    res.json(article); // Return the article data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching article', error: err.message });
  }
};


// UPDATE an article by ID
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Article.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: 'Article not found' });

    // Emit an event after the article is updated
    req.io.emit("articleUpdated", updated);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating article', error: err.message });
  }
};

// DELETE an article by ID
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Article.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Article not found' });

    // Emit an event after the article is deleted
    req.io.emit("articleDeleted", { id });

    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting article', error: err.message });
  }
};
