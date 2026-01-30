const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser')
// Load environment variables
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads')); 
app.use(cookieParser()); 

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Route handling
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/boards', require('./routes/boardRoute'))
app.use('/api/column', require('./routes/columnRoute'))
app.use('/api/tasks', require('./routes/taskRoutes'))
app.use('/api/notifications', require('./routes/notificationRoute'))

// Default route
app.get('/', (req, res) => {
  res.render('layout', { title: 'SageUp'});
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

