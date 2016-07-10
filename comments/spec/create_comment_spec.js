function Comment({text: _text}) {
    var _id

    this.setId = function (value) {
        _id = value
    }

    this.id = function () {
        return _id
    }

    this.text = function () {
        return _text
    }
}

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
        return commentRepo.findByText(text) != null;
    }

    function notifyValidationFailure(field, validation) {
        observer.validationFailed([{field: field, value: validation}])
    }

    function noText() {
        return text == "";
    }

    function saveComment() {
        var w = new Comment({text: text});
        commentRepo.save(w)
        observer.commentCreated(w.id)
    }
}

describe("create comment", function () {
    const context = describe
    const specify = it

    var repo, observer

    beforeEach(function () {
        repo = new FakeCommentRepo()
        observer = new ObserverSpy()
    })

    context("when a text is not provided", function () {
        specify("then the observer is notified", function () {
            createComment({text: ""}, {commentRepo: repo, observer: observer})

            expect(observer.spyValidationErrors()).toContain({field: "text", value: "required"})
        })
    })

    context("when a text is not unique", function () {
        specify("then the observer is notified", function () {
            var attrs = {text: "a valid text"};

            createComment(attrs, {commentRepo: repo, observer: observer})
            createComment(attrs, {commentRepo: repo, observer: observer})

            expect(observer.spyValidationErrors()).toContain({field: "text", value: "unique"})
        })
    })

    context("when a text is provided and unique", function () {
        specify("then the observer is provided a unique identifier for the created comment", function () {
            var attrs = {text: "a valid text"};

            createComment(attrs, {commentRepo: repo, observer: observer})

            expect(observer.spyCreatedCommentId()).toBeDefined()
        })
    })

    function ObserverSpy() {
        var validationErrors = null
        var commentId = null

        this.validationFailed = function (errors) {
            validationErrors = errors
        }

        this.spyValidationErrors = function () {
            return validationErrors;
        }

        this.commentCreated = function (id) {
            commentId = id
        }

        this.spyCreatedCommentId = function () {
            return commentId;
        }
    }
})

function FakeCommentRepo() {
    var comments = []

    this.findByText = function (text) {
        return comments.find((w) => w.text() == text)
    }

    this.save = function (comment) {
        comment.setId(Math.random())
        comments.push(comment)
    }

}

describe("comment repo", function () {
    var repo, sf, ny

    beforeEach(function () {
        repo = new FakeCommentRepo()

        sf = new Comment({text: "SF"})
        ny = new Comment({text: "NY"})

        repo.save(sf)
        repo.save(ny)
    })

    it("generates unique ids for comments", function () {
        expect(sf.id()).toBeDefined()
        expect(ny.id()).toBeDefined()
        expect(sf.id()).not.toEqual(ny.id())

    })

    it("finds by text", function () {
        expect(repo.findByText(sf.text())).toEqual(sf)
        expect(repo.findByText(ny.text())).toEqual(ny)
    })
})