import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';


const MainPage = () => {
  const navigate = useNavigate();
  const [selectedContinent, setSelectedContinent] = useState('');
  const [articleUpdates, setArticleUpdates] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isZeusOrOwner, setIsZeusOrOwner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allArticles, setAllArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  

  const continents = [
    'Europe', 'North America', 'South America',
    'Asia', 'Oceania', 'Africa'
  ];

  const handleArticleClick = (id) => {
    navigate(`/article/${id}`);
  };  

  const handleSelectContinent = (continent) => {
    setSelectedContinent(selectedContinent === continent ? '' : continent);
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
  
    if (token && username) {
      const decodedToken = parseJwt(token);
      const currentTime = Math.floor(Date.now() / 1000);
  
      if (decodedToken && decodedToken.exp > currentTime) {
        setIsLoggedIn(true);
        if (decodedToken.IsZeus || decodedToken.IsOwner) {
          setIsZeusOrOwner(true);
        } else {
          setIsZeusOrOwner(false);  // set to false if the user is not Zeus or Owner
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        alert("Session expired. You have been logged out.");
        setIsLoggedIn(false);
      }
    }
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let url = `${process.env.REACT_APP_API}/article`;
        if (selectedContinent) {
          url += `?continent=${encodeURIComponent(selectedContinent)}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setAllArticles(data);
        setArticles(data);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      }
    };

    fetchArticles();
  }, [selectedContinent]);

  useEffect(() => {
    if (!searchTerm) {
      setArticles(allArticles);
    } else {
      const filtered = allArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setArticles(filtered);
    }
  }, [searchTerm, allArticles]);
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      alert("Logged out successfully.");
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const handleAddArticle = () => {
    navigate("/AddArticle");
  };

  return (
    <div className="main-page">
      <header className="navbar">
        <div className="logo"><h1>MNN</h1></div>
        <nav>
          <ul className="continent-list">
            {continents.map((continent, index) => (
              <li
                key={index}
                className={selectedContinent === continent ? 'active' : ''}
                onClick={() => handleSelectContinent(continent)}
              >
                {continent}
              </li>
            ))}
          </ul>
        </nav>
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className="line" /><div className="line" /><div className="line" />
        </div>
      </header>

      {isMenuOpen && (
        <div className="menu">
          <button className="login-button" onClick={handleLoginLogout}>
            {isLoggedIn ? "Logout" : "Login"}
          </button>
          {isLoggedIn && isZeusOrOwner && (
            <button className="add-article-button" onClick={handleAddArticle}>
              Add Article
            </button>
          )}
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <main className="article-section">
        <p>{articleUpdates && `Latest Update: ${articleUpdates}`}</p>
        {articles.length > 0 && (
          <div className="article-layout">
            <div
              className="featured-article"
              style={{
                backgroundImage: `url(${articles[0].coverImageUrl})`
              }}
              onClick={() => handleArticleClick(articles[0]._id)}
            >
              <div className="overlay">
                <h2>{articles[0].title}</h2>
                <p>{articles[0].author} — {new Date(articles[0].datePublished).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="article-grid">
              {articles.slice(1).map(article => (
                <div
                  key={article._id}
                  className="article-card"
                  style={{
                    backgroundImage: `url(${article.coverImageUrl})`
                  }}
                  onClick={() => handleArticleClick(article._id)}
                >
                  <div className="overlay">
                    <h3>{article.title}</h3>
                    <p>{article.author} — {new Date(article.datePublished).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainPage;
