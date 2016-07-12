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
        unique("text", errs);

        return errs
    }

    function error(field, validation){
        return {field: field, value: validation}
    }

    function required(field, errs) {
        if (comment[field]() == "" || comment[field]() == null) {
            errs.push(error(field, "required"))
        }
    }

    function unique(field, errs) {
        let camelizedField = field.substr(0, 1).toUpperCase() + field.substr(1)

        var finderMethod = "findBy" + camelizedField;

        if (!!repo[finderMethod](comment[field]())) {
            errs.push(error(field, "unique"))
        }
    }
}

module.exports = createComment