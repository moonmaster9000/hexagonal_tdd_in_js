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
            expect(sf.id()).toBeDefined()
            expect(ny.id()).toBeDefined()
            expect(sf.id()).not.toEqual(ny.id())

        })

        it("finds by text", function () {
            expect(repo.findByText(sf.text())).toEqual(sf)
            expect(repo.findByText(ny.text())).toEqual(ny)
        })
    })
}

module.exports = commentRepoContract