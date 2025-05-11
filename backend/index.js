const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const employeeRoutes = require( './routes/employeeRoutes.js') ;
const departmentRoutes = require( './routes/departmentRoutes.js');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/employees', employeeRoutes);
app.use('/departments', departmentRoutes);

app.get('/', (req, res) => {
  res.send('HRMS API is running...');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrms';

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Failed to connect to MongoDB:', err.message));

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});