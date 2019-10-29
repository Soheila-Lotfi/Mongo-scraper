
// $(document).ready(function () {


getArticles("/articles");




// when the user clicks on the scrape article button on the page, scrape new york times website and display the result on the page.
$(document).on("click", "#scrapebtn", scrapeArticles);
// //when the user clicks on the save articles button on the page, save articles and display it on the /saved page
$(document).on("click", ".save", saveArticles);
// // //when the user clicks on the Delete From Saved  button on the page, delete the article
$(document).on("click", "#clearbtn", clearArticles);



function scrapeArticles() {

    // doAjaxFirst(getArticleLater);

    // function doAjaxFirst(callback) {
    $.ajax({ url: "/scrape", method: "GET" }).then(function (err, res) {
        if (err) throw err;
        // console.log(res.title);
        // callback();
        // getArticles("/articles");
    })

    // }
    // function getArticleLater() {

    getArticlesafterScraping("/articles")
    // }

}


function getArticlesafterScraping(url) {
    $.getJSON(url, function (data) {
        initializeRows(data);

    })
}


// get articles from database and make a row for each article on the page
function getArticles(url) {

    $.getJSON(url, function (data) {
        if (data.length > 0) {
            initializeRows(data);

        }
        else if (data.length === 0) {
            makeNewRow();

        }

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
    newArticleCard.addClass("card mt-3");
    // card-header
    var newArticleCardHeading = $("<div>");
    newArticleCardHeading.addClass("card-header ");
    var saveArticle = $("<button>");
    saveArticle.text("SaveArticle");
    saveArticle.addClass("save btn ml-5 ");
    var newArticleHeadline = $("<a>").text(article.title + "").attr("href", article.link);


    // card-body
    var newArticleCardBody = $("<div>");
    newArticleCardBody.addClass("card-body");
    var newArticleBody = $("<p>").text(article.summary);



    newArticleCardHeading.append(newArticleHeadline);
    newArticleCardHeading.append(saveArticle);
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

    // delete articles from database
    $.ajax({
        url: "/api/articles",
        method: "DELETE"
    }).then(function () {
        $("#articles").empty();
        makeNewRow();
    })
    // empty div with id=articles from the home page

}

function makeNewRow() {
    // $("#articles").empty();

    var newRows = $(
        [

            "<div class='row'>",
            "<div class='col-12'>",
            "<div style='text-align: center; margin-top: 10px; background-color: #00e8ff;height: 50px;padding: 10px;font-weight: bold'>Oh! LOOK LIKES WE DO NOT HAVE ANY ARTICLES!</div>",
            "<div style='text-align: center; margin-top: 10px; background-color: #b5ff00;height: 50px;padding: 10px;font-weight: bold'>WHAT WOULD YOU LIKE TO DO?</div>",
            "<div style='text-align: center; margin-top: 10px; background-color: #ffd300;height: 50px;padding: 10px;font-weight: bold'>",
            "<a href='#' onclick='scrapeArticles()' style='color: #560c94; text-align: center; margin-top: 10px; background-color: #ffd300;height: 50px;padding: 10px;font-weight: bold; text-decoration:none'>Try Scraping New Articles</a>",
            "<a href='/saved'  style='color: #560c94; text-align: center; margin-top: 10px; background-color: #ffd300;height: 50px;padding: 10px;font-weight: bold; text-decoration:none'>Go To Saved Articles</a>",
            "</div>"
        ].join("")
    );
    $("#articles").append(newRows);

}




// })

