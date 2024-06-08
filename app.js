const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/production.json');
const app = express();

// Product routes
// const userRoutes = require('./routes/user');

// Middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(expressValidator());

// Add routers
// app.use('/api/v1/user', userRoutes);
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
    app.listen(port);
    console.log(`Server is running at http://localhost:${port}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);

module.exports = app;
