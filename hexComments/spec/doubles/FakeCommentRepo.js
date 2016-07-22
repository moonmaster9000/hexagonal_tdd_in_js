function FakeCommentRepo() {
    var comments = []

    this.findByText = function (text) {
        return comments.find((c) => c.getText() == text)
    }

    this.save = function (comment) {
        comment.setId(Math.random())
        comments.push(comment)
    }

}

module.exports = FakeCommentRepo