import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Article.css';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:82/article/${id}`);
        if (!res.ok) throw new Error('Failed to fetch article');
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:82/comment/article/${id}`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticle();
    fetchComments();
  }, [id]);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      alert('Logged out successfully');
      setIsLoggedIn(false);
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token || !username) {
      alert('You must be logged in to post a comment.');
      return;
    }

    const newCommentData = {
      username,
      articleId: id,
      commentContent: newComment,
    };

    try {
      const res = await fetch(`http://localhost:82/comment/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newCommentData),
      });

      if (!res.ok) throw new Error('Failed to post comment');
      const { newComment: savedComment } = await res.json();

      setComments([savedComment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('Error submitting comment');
    }
  };

  const goBack = () => navigate('/');

  if (!article) return <p>Loading...</p>;

  return (
    <div className="article-page">
      <header className="article-header">
        <button className="back-button" onClick={goBack}>Back</button>
        <h1 className="site-title">MNN</h1>
        <button className="login-but" onClick={handleLoginLogout}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </header>

      <div className="article-content">
        <h2 className="article-title">{article.title}</h2>
        <div className="article-meta">
          <p><strong>Author:</strong> {article.author}</p>
          <p><strong>Date:</strong> {new Date(article.datePublished).toLocaleDateString()}</p>
          <p><strong>Continent:</strong> {article.continent}</p>
          <p><strong>Country:</strong> {article.country}</p>
        </div>
          {article.coverImageUrl && (
            <div className="article-cover-image">
              <img src={article.coverImageUrl} alt="Article Cover" className="cover-image" />
            </div>
          )}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      <footer className="article-footer">
        <p>This article is written by <strong>{article.author}</strong>, an employee of MNN.</p>
      </footer>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        {isLoggedIn && (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              className="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              required
            />
            <button type="submit" className="submit-comment">Post Comment</button>
          </form>
        )}

        {comments.length > 0 ? (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-meta">
                  <span className="comment-username">{comment.user?.Username}</span>
                  <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <div className="comment-content">{comment.comment}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
