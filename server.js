const express = require('express');
const app = express();
const mongoConn = require('./config/db');

// Connecting database
mongoConn();

// Initializing Middlewares
// This one is important to take user data sending via POST
// If this is not mentioned everything will work fine but we dont get users data
app.use(express.json({ extended: false }));

// Just for sample
app.get('/', (req, res) => {
  res.send('API running');
});

// Defining Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Started successfully on port ${PORT}`);
});
