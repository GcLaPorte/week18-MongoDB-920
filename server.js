var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// const routes = require("./routes");
var app = express();


var request = require("request");
var PORT = process.env.PORT || 3000;
var path = require("path");
var logger = require("morgan");


var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var Save = require("./models/Save.js");


// var exphbs = require("express-handlebars");
// var request = require("request");
var cheerio = require("cheerio");




// Parse application/x-www-form-urlencoded
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("./public"));

// connect to database
mongoose.Promise = Promise;
var dbConnect = process.env.MONGODB_URI || "mongodb://localhost/3000";
// var dbConnect = process.env.MONGODB_URI || "https://git.heroku.com/sheltered-brook-18915.git";

if(process.env.MONGODB_URI) {
    mongoose.connecreateConnection(process.env.MONGODB_URI)
} else {
    mongoose.createConnection(dbConnect);
}

mongoose.connect(dbConnect, function (error) {
    // Log any errors connecting with mongoose
    if (error) {
        console.log(error);
    }
    // Or log a success message
    else {
        console.log("Mongoose connection is successful");
    }
});
var db = mongoose.connection;
db.on('error',function(err){
    console.log('Mongoose Error',err);
});
db.once('open', function(){
    console.log("Mongoose connection is successful");
});
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

require("./routes/scrape")(app);
require("./routes/html.js")(app);

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});