const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); 
const app = express();
const UserRoute = require(`./route/UserRoute`);
const CommentRoute = require(`./route/CommentRoute`);
const ArticleRoute = require(`./route/ArticleRoute`);
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://manticore-news-network.onrender.com", // Allow requests from any frontend 
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});


dotenv.config(); // Load environment variables

// MongoDB connection
const mongoURL = process.env.CONNECTION; // Connection string
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use(cors(`https://manticore-news-network.onrender.com`));

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Route handlers
app.use('/user', UserRoute);
app.use('/article', ArticleRoute);
app.use('/comment', CommentRoute);

// Check API is running
app.get('/', (req, res) => {
  res.json({ message: 'API is running successfully' });
});

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A client disconnected", socket.id);
  })
})


// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export app and io
module.exports = {app, io};
