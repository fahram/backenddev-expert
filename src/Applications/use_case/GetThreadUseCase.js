const CommentsReplies = require('../../Domains/comments/entities/CommentsReplies');
const ThreadComments = require('../../Domains/threads/entities/ThreadComments');

class GetThreadUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getAllCommentsOfThread(threadId);
    const replies = await this._replyRepository.getAllRepliesOfComment();
    const detailedComments = new CommentsReplies(comments, replies);
    return new ThreadComments(thread, detailedComments.comments);
  }
}

module.exports = GetThreadUseCase;
