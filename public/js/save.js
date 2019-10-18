


getArticles("/api/saved");


$(document).on("click", ".delete", deleteArticles);
$(document).on("click", "#clearbtn", clearArticles);
$(document).on("click", ".notebtn", createNotes);

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

    // // var modalHead=$("<div>").text("hi")
    // // $("document").append(modalHead);


    // //modal
    // var modalNote = $("<div>");
    // modalNote.addClass("modal").attr("id", "modalForNotes").attr("role", "dialog");

    // var modalDialog = $("<div>").addClass("modal-dialog").attr("role", "document");
    // var modalContent = $("<div>").addClass("modal-content");


    // //modal-header
    // var modalHeader = $("<div>").addClass("modal-header");
    // var modalTitle = $("<h4>").addClass("modal-title").text("Note For Article:");

    // var closeButton = $("<button>").addClass("close").attr("data-dismiss", "modal");
    // closeButton.text("+");
    // modalHeader.append(modalTitle, closeButton);


    // //modal-body
    // var modalBody = $("<div>").addClass("modal-body");
    // var modalBodyInput = $("<input>").attr("placeholder", "new note").attr("name", "newNote");
    // modalBody.append(modalBodyInput);


    // //modal-footer
    // var modalFooter = $("<div>").addClass("modal-footer");
    // var saveNote = $("<button>");
    // saveNote.text("SAVE NOTE");
    // saveNote.addClass(" btn btn-primary");
    // modalFooter.append(saveNote);

    // ///////
    // modalContent.append(modalHeader, modalBody, modalFooter);
    // modalDialog.append(modalContent);
    // modalNote.append(modalDialog);

    $("#modalForNotes").modal();

}







































































