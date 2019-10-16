var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3025;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoscraper", { useUnifiedTopology: true });

// Routes

// A GET route for scraping the new york times website
app.get("/scrape", function (req, res) {

    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);




        // Now, we grab every h2 within an article tag, and do the following:
        $("article a").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .find("h2")
                .text();
            result.link = $(this)
                .attr("href");
            result.summary = $(this)
                .find("p")
                .text();
            result.saved = "false";
            console.log("hi");


            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        res.json(result);
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {

    db.Article.find({ saved: false }).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.json(err);
    })
});
// Route for updating articles
app.put("/articles/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }).then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
    })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
})
// route for getting saved articles
app.get("/api/saved", function (req, res) {

    db.Article.find({ saved: true }).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.json(err);
    })
});
// Route for deleting an article
app.delete("/api/articles/:id", function (req, res) {

    db.Article.deleteOne({ _id: req.params.id }).then(function (date) {
        res.json(data);
    }).catch(function (err) {
        res.json(err)
    })
})

// html routes for two pages-/saved and / (home)
app.get("/saved", function (req, res) {
    res.sendFile(path.join(__dirname, "../MONGO-SCRAPER/public/save.html"));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../MONGO-SCRAPER/public/index.html"));
});


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
