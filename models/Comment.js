const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let CommentSchema = new Schema({

    body: {
        type: String,
        required: true
    }
})

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
