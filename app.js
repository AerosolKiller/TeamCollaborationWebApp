//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/UserDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// add encrypt package as a plugin
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

// create a user object
// .email and .password are "name" from html
app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(error){
        if (error) {
            console.log(error);
        } else {
            res.render("secrets");
        }
    });
});

// signin page 
// check for username and password

app.post("/login", function(req, res){
    //users entered
    const username = req.body.username;
    const password = req.body.password;

    // find username in DB.
    // "email" is from DB, "username" from user's input
    User.findOne({email: username}, function(error, foundUser) {
        if (error) {
            console.log(error);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, function() {
    console.log("server is running on port 3000");
});