const express = require('express');
const mongoose = require('mongoose');
const { query, matchedData, validationResult } = require('express-validator');
const config = require('./config/production.json');

const app = express();
app.use(express.json());

// Product routes
const userRoutes = require('./routes/user');

// Middleware
app.use(express.urlencoded({ extended: false }));

// Add routers
app.use('/api/v1/user', userRoutes);
app.get('/', function (req, res) {
  res.status(200).json({
    message: 'Successfully access MeetFood API.',
  });
});

// Database
const port = process.env.PORT || 3000;
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(config.mongodbConnectURI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

run().catch(console.dir);

module.exports = app;
