const Comment = require("./entities/comment")

function createComment(attributes, collaborators) {
    new CreateCommentUseCase(attributes, collaborators).execute()
}

function CreateCommentUseCase(attrs, {commentRepo, observer}) {
    var _comment = null
    var _commentValidator = null

    this.execute = function () {
        if (commentInvalid()){
            notifyValidationFailures()
        } else {
            saveComment()
        }
    }

    function commentInvalid(){
        return !commentValidator().isValid()
    }

    function commentValidator(){
        _commentValidator = _commentValidator || new CommentValidator(comment(), commentRepo)
        return _commentValidator
    }

    function notifyValidationFailures(){
        observer.validationFailed(commentValidator().errors())
    }

    function comment(){
        _comment = _comment || new Comment(attrs)
        return _comment
    }

    function saveComment() {
        commentRepo.save(comment())
        observer.commentCreated(comment().getId(), comment().attributes())
    }
}

function CommentValidator(comment, repo){
    this.isValid = function () {
        return this.errors().length == 0
    }

    this.errors = function () {
        let errs = []

        required("text", comment.getText(), errs);
        required("author", comment.getAuthor(), errs);
        validateTextUnique(errs)

        return errs
    }

    function required(field, value, errors) {
        if (value == "" || value == null) {
            errors.push(error(field, "required"))
        }
    }

    function validateTextUnique(errors){
        if (!!repo.findByText(comment.getText())) {
            errors.push(error("text", "unique"))
        }
    }

    function error(field, validation){
        return {field: field, validation: validation}
    }
}

module.exports = createComment