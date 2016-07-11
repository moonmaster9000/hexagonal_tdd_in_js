function Comment({text: _text, id: _id = null}) {
    this.setId = function (value) {
        _id = value
    }

    this.id = function () {
        return _id
    }

    this.text = function () {
        return _text
    }

    this.attributes = function () {
        return {
            id: _id,
            text: this.text(),
        }
    }
}

module.exports = Comment