/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const path = require('path')

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// Establish connection
mongoose.connect(DATABASE_URL, CONFIG)

mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))

////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose

// const Schema = mongoose.mongo.Schema
// const model = mongoose.model

const {Schema, model} = mongoose

//Make fruits schema
const fruitSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean
})

//make fruit model
const Fruit = model('fruit', fruitSchema)

/////////////////////////////////////////////////
// Create our Express Application Object Bind Liquid Templating Engine
/////////////////////////////////////////////////
const app = require("liquid-express-views")(express(), {root: [path.resolve(__dirname, 'views/')]})






/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////


app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
app.use(express.static("public")); // serve files from public statically

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("your server is running... better catch it.");
  });
  
  app.get("/fruits/seed", (req, res) => {
    // array of starter fruits
    const startFruits = [
      { name: "Orange", color: "orange", readyToEat: false },
      { name: "Grape", color: "purple", readyToEat: false },
      { name: "Banana", color: "orange", readyToEat: false },
      { name: "Strawberry", color: "red", readyToEat: false },
      { name: "Coconut", color: "brown", readyToEat: false },
    ];
  
    // Delete all fruits
    Fruit.deleteMany({}).then((data) => {
      // Seed Starter Fruits
      Fruit.create(startFruits).then((data) => {
        // send created fruits as response to confirm creation
        res.json(data);
      });
    });
  });
  
  //INDEX
  app.get('/fruits', async (req, res) => {
      const fruits = await Fruit.find({})
      res.render('index', {fruits})
  })


//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () => 
    console.log(`Now Listening on port ${PORT}`));
