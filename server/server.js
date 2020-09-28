const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const buildsRouter = require("./routes/builds");
const itemsRouter = require("./routes/items");

require("dotenv").config();

// create server
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// connect to MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB database connected successfully")
);

// establish routes
app.use("/", itemsRouter);
app.use("/builds", buildsRouter);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
