const DetailedCommentsReplies = require('../../Domains/comments/entities/CommentsReplies');
const DetailedThreadComments = require('../../Domains/threads/entities/ThreadComments');

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
    const ids = comments.map((x) => x.id);
    const replies = await this._replyRepository.getAllRepliesOfComment(ids);
    const detailedComments = new DetailedCommentsReplies(comments, replies);
    return new DetailedThreadComments(thread, detailedComments.comments);
  }
}

module.exports = GetThreadUseCase;
