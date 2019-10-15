
// getArticles("/scrape");

// for the first time the user load the page



function scrape() {
    $.ajax({ url: "/scrape", method: "GET" }).then(function (err, res) {
        if (err) throw err;
        getArticles("/articles");
    })
}

scrape();


$(document).on("click", "#scrapebtn", scrapeArticles);
$(document).on("click", ".save", saveArticles);
$(document).on("click", "#clearbtn", clearArticles);

var articles;

function scrapeArticles(event) {

    event.preventDefault();
    getArticles("/articles");


}

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

function clearArticles() {

    $("#articles").empty();
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
    $("#articles").append($newRows);

}








































































