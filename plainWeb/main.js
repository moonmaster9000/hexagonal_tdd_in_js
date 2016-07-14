const {createComment, FakeCommentRepo} = require("hexComments")
const commentRepo = new FakeCommentRepo();

function Observer() {
    this.validationFailed = function (errors) {
        clearErrors()
        presentErrors(errors)
    }

    this.commentCreated = function (id, comment) {
        clearErrors()
        presentComment(comment)
    }

    function clearErrors() {
        document.getElementById("validationErrors").innerHTML = ""
    }

    function presentComment(comment) {
        addHtmlToElement("comments", commentTemplate(comment))
    }

    function presentErrors(errors) {
        errors.forEach(
            (error) => addHtmlToElement("validationErrors", validationErrorTemplate(error))
        )
    }

    function addHtmlToElement(elementId, html) {
        document
            .getElementById(elementId)
            .insertAdjacentHTML("beforeend", html)
    }

    function commentTemplate({author, text}){
        return `
            <article>
                <h2> ${author} </h2>
                <p>${text}</p>
            </article>
            `
    }

    function validationErrorTemplate({field, validation}) {
        return `
            <li>
                <p>${field}: ${validation}</p>
            </li>
            `
    }
}

const observer = new Observer()

function submitCreateCommentForm(event){
    event.preventDefault()

    createComment(
        {
            text: document.getElementById("commentText").value,
            author: document.getElementById("commentAuthor").value,
        },
        {commentRepo: commentRepo, observer: observer}
    )
}

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("createCommentForm").addEventListener(
        "submit", submitCreateCommentForm
    )
})
