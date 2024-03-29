const CommentsReplies = require('../CommentsReplies');

describe('a CommentsReplies entities', () => {
  it('should throw error when replies or comments is not an array', () => {
    const payloadComment = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'a comment',
      date: '2021-12-22T07:22:23.775Z',
    };

    const payloadReplies = {};

    expect(() => new CommentsReplies(payloadComment, payloadReplies))
      .toThrowError('DETAILED_COMMENTS_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentsReplies object correctly', () => {
    const payloadComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        content: 'a comment',
        date: '2021-12-22T07:22:23.775Z',
      },
      {
        id: 'comment-234',
        username: 'dicoding',
        content: 'an another comment',
        date: '2022-01-11T07:22:23.775Z',
      },
    ];

    const payloadReplies = [
      {
        id: 'reply-123',
        comment: 'comment-123',
        username: 'fahram',
        date: '2022-01-11T07:22:23.775Z',
        content: '**balasan telah dihapus**',
      },
      {
        id: 'reply-456',
        comment: 'comment-123',
        username: 'fahram',
        date: '2022-01-11T07:25:23.775Z',
        content: 'a reply to the comment',
      },
    ];

    const {
      comments,
    } = new CommentsReplies(payloadComments, payloadReplies);

    expect(comments).toHaveLength(2);
    expect(comments).toStrictEqual([
      {
        id: payloadComments[0].id,
        username: payloadComments[0].username,
        date: payloadComments[0].date,
        content: payloadComments[0].content,
        replies: [
          {
            id: payloadReplies[0].id,
            content: payloadReplies[0].content,
            date: payloadReplies[0].date,
            username: payloadReplies[0].username,
          },
          {
            id: payloadReplies[1].id,
            content: payloadReplies[1].content,
            date: payloadReplies[1].date,
            username: payloadReplies[1].username,
          },
        ],
      },
      {
        id: payloadComments[1].id,
        username: payloadComments[1].username,
        date: payloadComments[1].date,
        content: payloadComments[1].content,
        replies: [],
      },
    ]);
  });
});
