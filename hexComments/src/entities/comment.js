function Comment({text, author = null, id = null}) {
    this.setId = function (value) {
        id = value
    }

    this.getId = function () {
        return id
    }

    this.getAuthor = function () {
        return author
    }

    this.getText = function () {
        return text
    }

    this.attributes = function () {
        return {
            id: this.getId(),
            author: this.getAuthor(),
            text: this.getText(),
        }
    }
}

module.exports = Comment