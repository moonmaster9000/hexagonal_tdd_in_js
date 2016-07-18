import Ember from 'ember'
import * as hexComments from 'npm:hexComments'

const comments = hexComments.default

const repo = new comments.FakeCommentRepo()

export default Ember.Controller.extend({
    author: '',
    text: '',
    comments: [],
    errors: [],

    commentCreated(id, attrs){
        this.set('errors', [])
        this.set('comments', this.get('comments').concat(attrs))
    },
    
    validationFailed(errors){
        this.set('errors', errors)  
    },

    actions: {
        submitForm(){
            comments.createComment(
                {author: this.author, text: this.text},
                {commentRepo: repo, observer: this}
            )
        }
    }
})
