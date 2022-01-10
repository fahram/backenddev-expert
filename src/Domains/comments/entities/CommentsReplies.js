class CommentsReplies {
  constructor(comments, detailedReplies) {
    if (!Array.isArray(comments) || !Array.isArray(detailedReplies)) {
      throw new Error('DETAILED_COMMENTS_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.comments = comments.map((comment) => {
      const replies = detailedReplies.filter((reply) => reply.commentId === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
        }));

      return { ...comment, replies };
    });
  }
}

module.exports = CommentsReplies;
