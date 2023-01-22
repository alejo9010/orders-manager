const express = require('express');
const path = require('path');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

//connect to database
const PORT = process.env.PORT || 8000;
const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/servers', require('./routes/serverRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
//serve frontend
if (process.env.NODE_ENV == 'production') {
  //Set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(201).json({ message: 'Welcome to the Support Desk Api' });
  });
}
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
