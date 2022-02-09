const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const AddLikeUseCase = require('../AddLikeUseCase');

describe('AddLikeUseCase', () => {
  it('should orchestrate the add like use case properly when like doesnt exist', async () => {
    // arrange
    const useCaseParam = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependancies for use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed functions */
    mockLikeRepository.checkLikeIsExists = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.checkCommentBelongsToThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // action
    await addLikeUseCase.execute(useCaseParam);

    // assert
    expect(mockCommentRepository.checkCommentBelongsToThread)
      .toBeCalledWith(useCaseParam.thread, useCaseParam.comment);
    expect(mockLikeRepository.addLike).toBeCalledWith(new NewLike({
      comment: useCaseParam.comment,
      owner: useCaseParam.owner,
    }));
  });
  it('should orchestrate the add like use case properly when like does exist', async () => {
    // arrange
    const useCaseParam = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependancies for use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed functions */
    mockLikeRepository.checkLikeIsExists = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.deleteLikeByCommentAndOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.checkCommentBelongsToThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addLikeUseCase = new AddLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // action
    await addLikeUseCase.execute(useCaseParam);

    // assert
    expect(mockCommentRepository.checkCommentBelongsToThread)
      .toBeCalledWith(useCaseParam.thread, useCaseParam.comment);
    expect(mockLikeRepository.deleteLikeByCommentAndOwner).toBeCalledWith(new NewLike({
      comment: useCaseParam.comment,
      owner: useCaseParam.owner,
    }));
  });
});
