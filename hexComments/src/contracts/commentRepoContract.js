const Comment = require("../entities/comment")

function commentRepoContract(CommentRepoClass){
    describe("comment repo", function () {
        var repo, sf, ny

        beforeEach(function () {
            repo = new CommentRepoClass()

            sf = new Comment({text: "SF"})
            ny = new Comment({text: "NY"})

            repo.save(sf)
            repo.save(ny)
        })

        it("generates unique ids for comments", function () {
            expect(sf.getId()).toBeDefined()
            expect(ny.getId()).toBeDefined()
            expect(sf.getId()).not.toEqual(ny.getId())
        })

        it("finds by text", function () {
            expect(repo.findByText(sf.getText())).toEqual(sf)
            expect(repo.findByText(ny.getText())).toEqual(ny)
        })
    })
}

module.exports = commentRepoContract