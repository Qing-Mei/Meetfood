const express = require("express");
const app = express();
const user = require("./routes/user");
const mongoose = require("mongoose");

const port = 3000;
app.use("/api/v1", user);

const uri =
  "mongodb+srv://admin:meetfood@cluster0.w3xledd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);
