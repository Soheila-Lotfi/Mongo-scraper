


getArticles("/api/saved");


$(document).on("click", ".delete", deleteArticles);
$(document).on("click", "#clearbtn", clearArticles);
$(document).on("click", ".notebtn", createNotes);
$(document).on("click", ".save", saveNotes);
// var articles;

// function scrapeArticles(event) {

//     event.preventDefault();
//     getArticles("/articles");


// }

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
    newArticleCard.addClass("card");
    // card-header
    var newArticleCardHeading = $("<div>");
    newArticleCardHeading.addClass("card-header");
    var deleteArticle = $("<button>");
    deleteArticle.text("DELETE FROM SAVED");
    deleteArticle.addClass("delete btn btn-danger");

    var articleNotes = $("<button>");
    articleNotes.text("ARTICLE NOTES");
    articleNotes.addClass("notebtn btn btn-danger");
    var newArticleHeadline = $("<h2>").text(article.title + "");


    // card-body
    var newArticleCardBody = $("<div>");
    newArticleCardBody.addClass("card-body");
    var newArticleBody = $("<p>").text(article.summary);
    var newArticleLink = $("<a>").text(article.link).attr("href", article.link)


    newArticleCardHeading.append(newArticleHeadline);
    newArticleCardHeading.append(deleteArticle, articleNotes);
    newArticleCardBody.append(newArticleLink);
    newArticleCardBody.append(newArticleBody);


    newArticleCard.append(newArticleCardHeading);
    newArticleCard.append(newArticleCardBody);
    newArticleCard.data("article", article);
    return newArticleCard;

}

function deleteArticles() {

    const article = $(this).parent().parent().data("article")    // this refers to save button
    const id = article._id;
    $.ajax({
        url: "/api/articles/" + id,
        method: "DELETE"
    }).then(function () {
        $("#articles").empty();
        getArticles("/api/saved")
    });
}

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
            "<div>Oh! LOOK LIKES WE DO NOT HAVE ANY ARTICLES!</div>",
            "</div>",
            "</div>",
            "<div class='row'>",
            "<div class='card'>",
            "<div class='card-header'>WHAT WOULD YOU LIKE TO DO?</div>",
            "<div class='card-body'>",
            "<a href='/'>Browse Articles</a>",
            "</div>",
            "</div>",
            "</div>"
        ].join("")
    );
    $("#articles").append(newRows);

}


function createNotes() {
    // display the modal
    $("#modalForNotes").modal();
    // get the id of the article and show the id on the modal-header
    var article = $(this).parent().parent().data("article");

    var id = article._id;

    var articleId = $(["<h4>notes for the article :</h4>", "<span class='associatedid'>" + id + "</span>"].join(""));
    $(".modal-header").html(articleId);

    $.ajax({
        url: "/notes/" + id,
        method: "GET",
    }).then(function(data){
        $(".note-container").empty();
        data.forEach(element => {
            var list=$("<li>").addClass("list-group-item").text(element.comment.body);
            $(".note-container").append(list);
        });

        // <li class="list-group-item">No notes for this article yet.</li>
    })

}


function saveNotes() {

    var comment = $("#userComment").val();
    var id = $(".associatedid").text();   // grab the text inside the sapn using text() or html() method

    $.ajax({
        url: "/notes/" + id,
        method: "POST",
        data: {
            body: comment
        }
    }).then(function (data) {
        $("#modalForNotes").hideAll();

        
    })
}




































































