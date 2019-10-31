


getArticles("/api/saved");


$(document).on("click", ".delete", deleteArticles);
$(document).on("click", "#clearbtn", clearArticles);
$(document).on("click", ".notebtn", handleArticleNotes);
$(document).on("click", ".btn.save", handleNoteSave);
$(document).on("click", ".btn.note-delete", handleNoteDelete);
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
    articleNotes.addClass("notebtn btn ml-5 ");
    var newArticleHeadline = $("<a>").text(article.title + "").attr("href", article.link);


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


function handleArticleNotes(event) {
    // This function handles opening the notes modal and displaying our notes
    // We grab the id of the article to get notes for from the card element the delete button sits inside
    const currentArticle = $(this).parent().parent().data("article")

    // Grab any notes with this headline/article id
    $.get("/api/notes/" + currentArticle._id).then(function (data) {

        
        var commentData = {
            _id: currentArticle._id,
            comments: data.comment || []
        };
        console.log(data)
        // Constructing our initial HTML to add to the notes modal
        var modalText = $("<div class='container-fluid text-center'>").append(
            $("<h4>").text("Notes For Article: " + currentArticle._id),
            $("<hr>"),
            $("<ul class='list-group note-container'>"),
            $("<textarea placeholder='New Note' rows='4' cols='60'>"),
            $("<button class='btn btn-success save'>Save Note</button>")
        );
        // Adding the formatted HTML to the note modal
        bootbox.dialog({
            message: modalText,
            closeButton: true
        });

        // Adding some information about the article and article notes to the save button for easy access
        // When trying to add a new note
        $(".btn.save").data("article", commentData);
        // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
        renderNotesList(commentData);
    });
}

function renderNotesList(data) {
    // This function handles rendering note list items to our notes modal
    // Setting up an array of notes to render after finished
    // Also setting up a currentNote variable to temporarily store each note
    var commentsToRender = [];
    var currentComment;

    if (!data.comments.length) {
        // If we have no notes, just display a message explaining this
        currentComment = $("<li class='list-group-item'>No notes for this article yet.</li>");
        commentsToRender.push(currentComment);
    } else {
        // If we do have notes, go through each one
        for (var i = 0; i < data.comments.length; i++) {
            // Constructs an li element to contain our noteText and a delete button
            currentComment = $("<li class='list-group-item note'>")
                .text(data.comments[i].body)
                .append($("<button class='btn btn-danger note-delete'>x</button>"));
            // Store the note id on the delete button for easy access when trying to delete
            currentComment.children("button").data("_id", data.comments[i]._id);
            // Adding our currentNote to the notesToRender array
            commentsToRender.push(currentComment);
        }
    }
    // Now append the notesToRender to the note-container inside the note modal
    $(".note-container").append(commentsToRender);

}


function handleNoteSave() {
    // This function handles what happens when a user tries to save a new note for an article
    // Setting a variable to hold some formatted data about our note,
    // grabbing the note typed into the input box
    var newNote = $(".bootbox-body textarea")
        .val()
        .trim(); 

        var id=$(this).data("article")._id;


    // If we actually have data typed into the note input field, format it
    // and post it to the "/api/notes" route and send the formatted noteData as well
    if (newNote) {
        $.ajax({
            method: "POST",
            url: "/api/notes/"+ id,
            data: {
                body:newNote
            }
        })
            // With that done
            .then(function (res) {
                bootbox.hideAll();
                console.log(res)
        
            });
    }
}


function handleNoteDelete() {
    // This function handles the deletion of notes
    // First we grab the id of the note we want to delete
    // We stored this data on the delete button when we created it
    var noteToDelete = $(this).data("_id");
    console.log(noteToDelete)
    // Perform an DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }

































































