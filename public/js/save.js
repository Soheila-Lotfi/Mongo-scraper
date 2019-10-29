


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
            $("#articles").empty();
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
    newArticleCardHeading.addClass("card-header");
    var deleteArticle = $("<button>");
    deleteArticle.text("DELETE FROM SAVED");
    deleteArticle.addClass("delete btn mr-5").css("right", "120px");




    var articleNotes = $("<button>");
    articleNotes.text("ARTICLE NOTES");
    articleNotes.addClass("notebtn btn ml-5 ").attr("data-toggle", "modal").attr("data-target", "myModal");
    var newArticleHeadline =  $("<a>").text(article.title + "").attr("href", article.link);


    // card-body
    var newArticleCardBody = $("<div>");
    newArticleCardBody.addClass("card-body");
    var newArticleBody = $("<p>").text(article.summary);



    newArticleCardHeading.append(newArticleHeadline);
    newArticleCardHeading.append(deleteArticle, articleNotes);
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
            "<div style='text-align: center; margin-top: 10px; background-color: #00e8ff;height: 50px;padding: 10px;font-weight: bold'>Oh! LOOK LIKES WE DO NOT HAVE ANY ARTICLES!</div>",
            "<div style='text-align: center; margin-top: 10px; background-color: #b5ff00;height: 50px;padding: 10px;font-weight: bold'>WHAT WOULD YOU LIKE TO DO?</div>",
            "<div style='text-align: center; margin-top: 10px; background-color: #ffd300;height: 50px;padding: 10px;font-weight: bold'>",
            "<a href='/'  style='color: #560c94; text-align: center; margin-top: 10px; background-color: #ffd300;height: 50px;padding: 10px;font-weight: bold; text-decoration:none'>Browse Articles</a>",
            "</div>"
        ].join("")
    );
    $("#articles").append(newRows);

}


// function createNotes() {
//     // display the modal
//     $("#myModal").modal();
//     // get the id of the article and show the id on the modal-header
//     var article = $(this).parent().parent().data("article");

//     var id = article._id;

//     var articleId = $(["<h4>notes for the article :</h4>", "<span class='associatedid'>" + id + "</span>"].join(""));
//     $(".modal-title").html(articleId);

//     $.ajax({
//         url: "/notes/" + id,
//         method: "GET",
//     }).then(function (data) {
//         $(".note-container").empty();
//         if (data.comment) {
//             data.forEach(element => {
//                 var list = $("<li>").addClass("list-group-item").text(element.comment.body);
//                 $(".note-container").append(list);
//             });
//         }

//     })

// }


// function saveNotes() {

//     var comment = $("#userComment").val();
//     var id = $(".associatedid").text();   // grab the text inside the span using text() or html() method

//     $.ajax({
//         url: "/notes/" + id,
//         method: "POST",
//         data: {
//             body: comment
//         }
//     }).then(function (data) {
//         $("#modalForNotes").addClass("display", "none");



//     })
// }




































































