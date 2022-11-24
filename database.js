//Import the mongoose module
var mongoose = require("mongoose");

//Set up default mongoose connection
var mongoDB_local = "mongodb://127.0.0.1/my-blog729";
var mongoDB =
  "mongodb+srv://root:root@cluster0.rd3cdiv.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
