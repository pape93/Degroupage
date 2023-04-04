const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user.model');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your MongoDB connection string
const uri = 'mongodb+srv://pape93:tTNvRtDrSxBRAEZC@cluster0.quynr8t.mongodb.net/degroup'; 
//mongosh "mongodb+srv://cluster0.quynr8t.mongodb.net/Cluster0" --apiVersion 1 --username pape93 --password tTNvRtDrSxBRAEZC
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    console.log('Received login request:', { username, password });
  
    try {
      const user = await User.findOne({ username });
  
      console.log('Found user:', user);
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
