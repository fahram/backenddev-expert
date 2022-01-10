const GetThreadEntity = require('../../../Domains/threads/entities/GetThreadEntity');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentsReplies = require('../../../Domains/comments/entities/CommentsReplies');
const ThreadComments = require('../../../Domains/threads/entities/ThreadComments');

describe('GetThreadUseCase', () => {
  it('it should orchecstrate the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2022-01-09T07:19:09.775Z',
        content: 'sebuah komentar',
        is_delete: false,
      },
    ];
    const expectedThread = new GetThreadEntity({
      id: 'thread-123',
      title: 'sebuah judul',
      body: 'sebuah body',
      date: '2022-01-09T07:19:09.775Z',
      username: 'dicoding',
    });
    const commentId = ['comment-123'];
    const expectedReplies = [
      {
        id: 'reply-123',
        content: 'sebuah komentar',
        date: '2022-01-09T07:19:09.775Z',
        username: 'dicoding',
        is_delete: false,
      },
    ];
    const commentsReplies = new CommentsReplies(
      expectedComments,
      expectedReplies,
    );

    const expectedResponse = new ThreadComments(
      expectedThread,
      commentsReplies.comments,
    );

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.getAllCommentsOfThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));

    mockReplyRepository.getAllRepliesOfComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,

    });
    const threadResult = await getThreadUseCase.execute(threadId);
    // Assert
    expect(threadResult).toStrictEqual(expectedResponse);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getAllCommentsOfThread).toBeCalledWith(threadId);
    expect(mockReplyRepository.getAllRepliesOfComment).toBeCalledWith(commentId);
  });
});
