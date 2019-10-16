
$(document).ready(function () {


    function firstLoad() {
        if (getArticles("/articles")) {
            getArticles("/articles");
        }
        else {

            clearArticles();

        }
    }

    firstLoad();

    // when the user clicks on the scrape article button on the page, scrape new york times website and display the result on the page.
    $(document).on("click", "#scrapebtn", scrapeArticles);
    //when the user clicks on the save articles button on the page, save articles and display it on the /saved page
    $(document).on("click", ".save", saveArticles);
    //when the user clicks on the Delete From Saved  button on the page, delete the article
    $(document).on("click", "#clearbtn", clearArticles);



    function scrapeArticles(event) {

        event.preventDefault();
        //scrape new york times website
        $.ajax({ url: "/scrape", method: "GET" }).then(function (err, res) {
            if (err) throw err;
            console.log(res);

        })
        getArticles("/articles");


    }

    // get articles from database and make a row for each article on the page
    function getArticles(url) {

        $.getJSON(url, function (data) {

            initializeRows(data);
        })


    }

    function initializeRows(articles) {
        $("#articles").empty();
        var articlesToAdd = [];
        for (var i = 0; i < articles.length; i++) {
            articlesToAdd.push(createNewRow(articles[i]));
        }
        $("#articles").append(articlesToAdd);
    }

    // This function constructs a post's HTML
    function createNewRow(article) {

        var newArticleCard = $("<div>");
        newArticleCard.addClass("card");
        // card-header
        var newArticleCardHeading = $("<div>");
        newArticleCardHeading.addClass("card-header");
        var saveArticle = $("<button>");
        saveArticle.text("SaveArticle");
        saveArticle.addClass("save btn btn-danger");
        var newArticleHeadline = $("<h2>").text(article.title + "");


        // card-body
        var newArticleCardBody = $("<div>");
        newArticleCardBody.addClass("card-body");
        var newArticleBody = $("<p>").text(article.summary);
        var newArticleLink = $("<a>").text(article.link).attr("href", article.link)


        newArticleCardHeading.append(newArticleHeadline);
        newArticleCardHeading.append(saveArticle);
        newArticleCardBody.append(newArticleLink);
        newArticleCardBody.append(newArticleBody);


        newArticleCard.append(newArticleCardHeading);
        newArticleCard.append(newArticleCardBody);
        newArticleCard.data("article", article);
        return newArticleCard;
    }
    // when you save an article, update the article, set saved value to true in server.js
    function saveArticles() {

        const article = $(this).parent().parent().data("article")    // this refers to save button
        const id = article._id;
        $.ajax({
            url: "/articles/"
                + id,
            method: "PUT"
        }).then(function () {
            getArticles("/articles")
        });
    }

    // clear the articles and replace them with some message and link as the following

    function clearArticles() {
        // empty div with id=articles from the home page
        $("#articles").empty();
        // Also delete srticles from database

        var $newRows = $(
            [

                "<div class='row'>",
                "<div class='col-12'>",
                "<div>Oh! LOOK LIKES WE DO NOT HAVE ANY ARTICLES!</div>",
                "</div>",
                "</div>",
                "<div class='row'>",
                "<div class='card'>",
                "<div class='card-header'>WHAT WOULD YOU LIKE TO DO?</div>",
                "<div class='card-body'>",
                "<a href=''>Try Scraping New Articles</a>",
                "<a href='/saved'>Go To Saved Articles</a>",
                "</div>",
                "</div>",
                "</div>"
            ].join("")
        );
        $("#articles").html($newRows);

    }

});

