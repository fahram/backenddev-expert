/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const CommentsReplies = require('../../Domains/comments/entities/CommentsReplies');
const ThreadComments = require('../../Domains/threads/entities/ThreadComments');

class GetThreadUseCase {
  constructor({
    commentRepository, threadRepository, replyRepository, likeRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getAllCommentsOfThread(threadId);
    const replies = await this._replyRepository.getAllRepliesOfComment();
    const detailedComments = new CommentsReplies(comments, replies);
    detailedComments.comments = await this._getLikeCountForComments(detailedComments.comments);
    return new ThreadComments(thread, detailedComments.comments);
  }

  async _getLikeCountForComments(comments) {
    for (let i = 0; i < comments.length; i += 1) {
      const commentId = comments[i].id;
      comments[i].likeCount = await this._likeRepository
        .getLikeCountByComment(commentId);
    }
    return comments;
  }
}

module.exports = GetThreadUseCase;
