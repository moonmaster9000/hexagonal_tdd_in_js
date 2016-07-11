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

module.exports = FakeCommentRepo