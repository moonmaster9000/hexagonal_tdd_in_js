const Comment = require("./entities/comment")

function createComment(attributes, collaborators) {
    new CreateCommentUseCase(attributes, collaborators).execute()
}

function CreateCommentUseCase({text}, {commentRepo, observer}) {
    this.execute = function () {
        if (commentAlreadyExists()) {
            notifyValidationFailure("text", "unique")
        } else if (noText()) {
            notifyValidationFailure("text", "required")
        } else {
            saveComment()
        }
    }

    function commentAlreadyExists() {
        return commentRepo.findByText(text) != null
    }

    function notifyValidationFailure(field, validation) {
        observer.validationFailed([{field: field, value: validation}])
    }

    function noText() {
        return text == "";
    }

    function saveComment() {
        var c = new Comment({text: text});
        commentRepo.save(c)
        observer.commentCreated(c.id(), c.attributes())
    }
}

module.exports = createComment