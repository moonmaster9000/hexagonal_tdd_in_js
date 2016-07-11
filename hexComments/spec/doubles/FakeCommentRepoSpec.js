const commentRepoContract = require("../../src/contracts/commentRepoContract")
const FakeCommentRepo = require("./FakeCommentRepo")

commentRepoContract(FakeCommentRepo)