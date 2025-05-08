import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AddArticle.css'; // Assuming you have the CSS file for styling

const AddArticle = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [datePublished, setDatePublished] = useState('');
  const [continent, setContinent] = useState('');
  const [country, setCountry] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [author, setAuthor] = useState(''); // Make sure the author is set correctly

  const continents = [
    'Europe',
    'North America',
    'South America',
    'Asia',
    'Oceania',
    'Africa',
  ];

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }], // Font size options
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };
  
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'color', 'background', 'link', 'image'
  ];
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  
    const decoded = parseJwt(token);
    console.log('Decoded token:', decoded); // <-- ADD THIS LINE
  
    if (decoded?.username) {
      setAuthor(decoded.username); // Default to the logged-in user's username
    } else {
      alert('Invalid token, please log in again.');
      navigate('/login');
    }
  }, [navigate]);
  
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };
  

  // Handle form submission to add an article
  const handleSubmit = async (e) => {
    e.preventDefault();

    const articleData = {
      title,
      content,
      author,  // Ensure this is properly included
      datePublished,
      continent,
      country,
      coverImageUrl,
    };

    try {
      const res = await fetch('http://localhost:82/article/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(articleData),
      });

      if (!res.ok) throw new Error('Failed to add article.');

      alert('Article added successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('There was an error submitting your article.');
    }
  };

  return (
    <div className="add-article-container">
      <h1>Add a New Article</h1>
      {/* Display Author and Date Published only when both are filled */}
      {author && datePublished && (
        <h2>
          {author} — {datePublished}
        </h2>
      )}
      <form onSubmit={handleSubmit} className="add-article-form">
        {/* Title Input */}
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Content Input (React Quill) */}
        <label htmlFor="content">Body:</label>
        <ReactQuill
        id="content"
        value={content}
        onChange={setContent}
        theme="snow"
        placeholder="Write your article content here..."
        modules={modules}
        formats={formats}
        required
        />


        {/* Date Published Input */}
        <label htmlFor="datePublished">Date Published:</label>
        <input
          id="datePublished"
          type="date"
          value={datePublished}
          onChange={(e) => setDatePublished(e.target.value)}
          required
        />

        {/* Continent Dropdown */}
        <label htmlFor="continent">Continent:</label>
        <select
          id="continent"
          value={continent}
          onChange={(e) => setContinent(e.target.value)}
          required
        >
          <option value="">Select Continent</option>
          {continents.map((cont) => (
            <option key={cont} value={cont}>
              {cont}
            </option>
          ))}
        </select>

        {/* Country Input */}
        <label htmlFor="country">Country:</label>
        <input
          id="country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />

        {/* Cover Image URL Input */}
        <label htmlFor="coverImageUrl">Cover Image URL:</label>
        <input
          id="coverImageUrl"
          type="text"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
          required
        />

        {/* Submit Button */}
        <button type="submit">Publish Article</button>
      </form>
    </div>
  );
};

export default AddArticle;
