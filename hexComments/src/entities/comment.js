function Comment({text: _text, author: _author = null, id: _id = null}) {
    this.setId = function (value) {
        _id = value
    }

    this.id = function () {
        return _id
    }

    this.author = function () {
        return _author
    }

    this.text = function () {
        return _text
    }

    this.attributes = function () {
        return {
            id: this.id(),
            author: this.author(),
            text: this.text(),
        }
    }
}

module.exports = Comment