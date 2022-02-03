const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const AddLikeUseCase = require('../AddLikeUseCase');

describe('AddLikeUseCase', () => {
  it('should orchestrate the add like use case properly', async () => {
    // arrange
    const useCaseParam = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    const useCaseHeader = {
      authorization: 'Bearer accessToken',
    };

    /** creating dependancies for use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed functions */
    mockLikeRepository.checkLikeIsExists = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockAuthenticationTokenManager.getTokenFromHeader = jest.fn()
      .mockImplementation(() => Promise.resolve('accessToken'));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }));

    mockCommentRepository.checkCommentBelongsToThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // action
    await addLikeUseCase.execute(useCaseParam, useCaseHeader);

    // assert
    expect(mockCommentRepository.checkCommentBelongsToThread)
      .toBeCalledWith(useCaseParam.thread, useCaseParam.comment);
    expect(mockLikeRepository.addLike).toBeCalledWith(new NewLike({
      comment: useCaseParam.comment,
      owner: useCaseParam.owner,
    }));
  });
});
