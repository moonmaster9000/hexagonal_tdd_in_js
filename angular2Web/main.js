const core = require("@angular/core")
const forms = require("@angular/forms")
const {createComment, FakeCommentRepo} = require("hexComments")

const repo = new FakeCommentRepo()

const CommentList = core.Component({
    selector: 'comment-list',
    inputs: ['comments'],
    template: `
        <article *ngFor="let comment of comments">
            <h2>{{ comment.author }}</h2>
            <p>{{ comment.text }}</p>
        </article>
    `
}).Class({
    constructor: function () {
    }
})

const CommentForm = core.Component({
    selector: 'my-app',
    template: `
        <ul>
            <li *ngFor="let error of errors">{{ error.field }}: {{ error.validation }}</li>
        </ul>
        
        <form (submit)="onSubmit($event)">
            <label for="author">Author</label>
            <input type="text" name="author" [(ngModel)]="model.author" >
            <label for="text">Comment</label>
            <input type="text" name="text" [(ngModel)]="model.text" >
            
            <button type="submit">Submit</button>
        </form>
        
        <comment-list [comments]="comments"></comment-list>
        `,
    directives: [ CommentList ]
}).Class({
        constructor: function () {
            this.model = {author: "", text: ""}
            this.errors = []
            this.comments = []
        },

        commentCreated: function (id, attrs) {
            this.errors = []
            this.model = {author: "", text: ""}
            this.comments = this.comments.concat(attrs)
        },

        validationFailed: function (errors) {
            this.errors = errors
        },

        onSubmit: function (e) {
            e.preventDefault()

            createComment(this.model, {commentRepo: repo, observer: this})
        }
    }
)

const {bootstrap} = require("@angular/platform-browser-dynamic")

document.addEventListener("DOMContentLoaded", function () {
    bootstrap(
        CommentForm,
        [
            forms.disableDeprecatedForms(),
            forms.provideForms()
        ]
    )
})
