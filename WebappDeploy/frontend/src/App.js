import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import Login from './Login';
import Register from './Register';
import AddArticle from './AddArticle';
import Article from './Article';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/AddArticle" element={<AddArticle/>} />
        <Route path="/article/:id" element={<Article/>} />
      </Routes>
    </Router>
  );
};

export default App;
