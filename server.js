var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");

//we need cheerio to Parses our HTML and helps us find elements
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3026;

// Initialize Express
var app = express();

// Configure middleware
///// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB- the name of database will be mongoscraper
// mongoose.connect("mongodb://<dbuser>:<dbpassword>@ds141188.mlab.com:41188/heroku_rqrnzqz8", { useUnifiedTopology: true });
mongoose.connect(process.env.MONGODB_URI || "mongodb://<dbuser>:<dbpassword>@ds141188.mlab.com:41188/heroku_rqrnzqz8");
// Routes

// A GET route for scraping the new york times website
app.get("/scrape", function (req, res) {

    var articlesArray = [];

    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab  every h2 within an article tag, and do the following:
        var articles = $("article a").slice(0, 10)
        articles.each(function (i, element) {
            // Save an empty result object
            var result = {};
            var link;
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .find("h2")
                .text();
            link = $(this)
                .attr("href");
            result.link = "https://www.nytimes.com" + link;
            console.log(result.link);
            result.summary = $(this)
                .find("p")
                .text();
            result.saved = "false";

            articlesArray.push(result);

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

        res.json(articlesArray);
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

// Route for deleting all the articles

app.delete("/api/articles", function (req, res) {

    db.Article.remove().then(function (date) {
        res.json(data);
    }).catch(function (err) {
        res.json(err)
    })
})

// route for saving a comment

app.post("/api/notes/:id", function (req, res) {
    db.Comment.create(req.body).then(function (dbComment) {

        return db.Article.findByIdAndUpdate(req.params.id, { $push: { "comment": dbComment._id } }, { new: true });


    }).then(function (dbArticle) {
        res.json(dbArticle);

    }).catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
})

//route for deleting a comment

app.delete("/api/notes/:id", function (req, res) {

    db.Comment.deleteOne({ _id: req.params.id }).then(function (date) {
        res.json(data);
    }).catch(function (err) {
        res.json(err)
    })
})


// route for grabbing all notes associated with an article
app.get("/api/notes/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
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
