/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
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
    const replies = await this._replyRepository.getAllRepliesOfComment(comments.map((x) => x.id));
    for (const comment of comments) {
      comment.replies = replies.filter((reply) => reply.comment === comment.id);
    }
    thread.comments = comments;
    return thread;
  }
}

module.exports = GetThreadUseCase;
