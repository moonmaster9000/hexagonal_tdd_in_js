const Comment = require("./entities/comment")

function createComment(attributes, collaborators) {
    new CreateCommentUseCase(attributes, collaborators).execute()
}

function CreateCommentUseCase(attrs, {commentRepo, observer}) {
    var _comment = null

    this.execute = function () {
        if (commentInvalid()){
            notifyValidationFailures()
        } else {
            saveComment()
        }
    }

    function commentInvalid(){
        return !commentValidations().isValid()
    }

    function commentValidations(){
        return new CommentValidations(comment(), commentRepo)
    }

    function notifyValidationFailures(){
        observer.validationFailed(commentValidations().errors())
    }

    function comment(){
        _comment = _comment || new Comment(attrs)
        return _comment
    }

    function saveComment() {
        commentRepo.save(comment())
        observer.commentCreated(comment().id(), comment().attributes())
    }
}

function CommentValidations(comment, repo){
    this.isValid = function () {
        return this.errors().length == 0
    }

    this.errors = function () {
        let errs = []

        required("text", errs);
        required("author", errs);
        validateTextUnique(errs)

        return errs
    }

    function required(field, errors) {
        if (comment[field]() == "" || comment[field]() == null) {
            errors.push(error(field, "required"))
        }
    }

    function validateTextUnique(errors){
        if (!!repo.findByText(comment.text())) {
            errors.push(error("text", "unique"))
        }
    }
    function error(field, validation){
        return {field: field, value: validation}
    }

}

module.exports = createComment