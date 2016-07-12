const Comment = require("../src/entities/comment")
const createComment = require("../src/create_comment")
const FakeCommentRepo = require("./doubles/FakeCommentRepo")

describe("create comment", function () {
    const context = describe
    const specify = it

    var repo, observer

    beforeEach(function () {
        repo = new FakeCommentRepo()
        observer = new ObserverSpy()
    })

    context("when the text is empty", function () {
        specify("then the observer is notified", function () {
            createComment({text: ""}, {commentRepo: repo, observer: observer})

            expect(observer.spyValidationErrors()).toContain({field: "text", value: "required"})
        })
    })

    context("when the text is not provided", function () {
        specify("then the observer is notified", function () {
            createComment({}, {commentRepo: repo, observer: observer})

            expect(observer.spyValidationErrors()).toContain({field: "text", value: "required"})
        })
    })

    context("when an author is not provided", function(){
        specify("then the observer is notified", function(){
            createComment({}, {commentRepo: repo, observer: observer})

            expect(observer.spyValidationErrors()).toContain({field: "author", value: "required"})
        })
    })

    context("when an author is empty", function(){
        specify("then the observer is notified", function(){
            createComment({author: ""}, {commentRepo: repo, observer: observer})

            expect(observer.spyValidationErrors()).toContain({field: "author", value: "required"})
        })
    })

    context("when a text is not unique", function () {
        specify("then the observer is notified", function () {
            var attrs = {text: "a valid text", author: "a valid author"}

            createComment(attrs, {commentRepo: repo, observer: observer})
            createComment(attrs, {commentRepo: repo, observer: observer})

            expect(observer.spyValidationErrors()).toContain({field: "text", value: "unique"})
        })
    })

    context("when a text is provided and unique", function () {
        specify("then the observer is provided a unique identifier for the created comment", function () {
            var attrs = {text: "a valid text", author: "a valid author"}

            createComment(attrs, {commentRepo: repo, observer: observer})

            expect(observer.spyCreatedCommentId()).toBeDefined()
        })

        specify("and the observer is given the created comment", function () {
            var attrs = {text: "a valid text", author: "a valid author"}

            createComment(attrs, {commentRepo: repo, observer: observer})

            expect(observer.spyCreatedAttributes().text).toEqual(attrs.text)
        })
    })

    function ObserverSpy() {
        var validationErrors
        var commentId
        var createdAttributes

        this.validationFailed = function (errors) {
            validationErrors = errors
        }

        this.spyValidationErrors = function () {
            return validationErrors
        }

        this.commentCreated = function (id, attrs) {
            commentId = id
            createdAttributes = attrs
        }

        this.spyCreatedCommentId = function () {
            return commentId
        }

        this.spyCreatedAttributes = function() {
            return createdAttributes
        }
    }
})