

getArticles("/api/saved");

// $(document).on("click", "#scrapebtn", scrapeArticles);
// // $(document).on("click", "#clearbtn", clearArticles);
// $(document).on("click", ".save", saveArticles);

// var articles;

// function scrapeArticles(event) {

//     event.preventDefault();
//     getArticles("/articles");


// }

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
    var deleteArticle = $("<button>");
    deleteArticle.text("DELETE FROM SAVED");
    deleteArticle.addClass("save btn btn-danger");
    var newArticleHeadline = $("<h2>").text(article.title + "");


    // card-body
    var newArticleCardBody = $("<div>");
    newArticleCardBody.addClass("card-body");
    var newArticleBody = $("<p>").text(article.summary);
    var newArticleLink = $("<a>").text(article.link).attr("href", article.link)


    newArticleCardHeading.append(newArticleHeadline);
    newArticleCardHeading.append(deleteArticle);
    newArticleCardBody.append(newArticleLink);
    newArticleCardBody.append(newArticleBody);


    newArticleCard.append(newArticleCardHeading);
    newArticleCard.append(newArticleCardBody);
    newArticleCard.data("article", article);
    return newArticleCard;
   
}

// function saveArticles() {

//     const article = $(this).parent().parent().data("article")    // this refers to save button
//     const id = article._id;
//     $.ajax({
//         url: "/articles/"
//             + id,
//         method: "PUT"
//     }).then(function () {
//         getArticles("/articles")
//     });
// }








































































