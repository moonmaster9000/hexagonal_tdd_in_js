const {createComment, FakeCommentRepo} = require("hexComments")
const React = require("react")
const ReactDOM = require("react-dom")

var repo = new FakeCommentRepo()

var CommentBox = React.createClass({
    getInitialState: function () {
        return {comments: [], errors: []}
    },

    commentCreated: function (id, attributes) {
        this.setState({comments: this.state.comments.concat([attributes]), errors: []})
    },

    handleSubmit: function (commentAttributes) {
        createComment(commentAttributes, {commentRepo: repo, observer: this})
    },

    validationFailed: function (errors) {
        this.setState({errors: errors})
    },

    render: function () {
        return (
            <div>
                <CommentForm errors={this.state.errors} handleSubmit={this.handleSubmit}/>
                <CommentList comments={this.state.comments}/>
            </div>
        )
    }
})

var CommentForm = React.createClass({
    getInitialState: function () {
        return {author: '', text: ''}
    },

    handleAuthorChange: function (e) {
        this.setState({author: e.target.value})
    },

    handleTextChange: function (e) {
        this.setState({text: e.target.value})
    },

    handleSubmit: function (e) {
        e.preventDefault()

        var author = this.state.author.trim()
        var text = this.state.text.trim()

        this.props.handleSubmit({author, text})
    },

    render: function () {
        const errors = this.props.errors.map(
            (error) =>
                <li key={error.field + error.value}>{error.field}: {error.value}</li>
        )

        return (
            <div>
                <ul>{errors}</ul>

                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Your name"
                        value={this.state.author}
                        onChange={this.handleAuthorChange}
                    />
                    <input
                        type="text"
                        placeholder="Say something..."
                        value={this.state.text}
                        onChange={this.handleTextChange}
                    />
                    <input type="submit" value="Post"/>
                </form>
            </div>
        )
    }
})

var Comment = React.createClass({
    render: function () {
        return (
            <div>
                <h2>
                    {this.props.author}
                </h2>
                {this.props.children}
            </div>
        )
    }
})


var CommentList = React.createClass({
    render: function () {
        var comments = this.props.comments.map(
            (comment) =>
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
        )

        return (
            <div>
                {comments}
            </div>
        )
    }
})

ReactDOM.render(
    <CommentBox comments={[]}/>,
    document.getElementById('content')
)

