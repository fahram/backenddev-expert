const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');

const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add comment correctly to database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const newComment = new NewComment({
        content: 'sebuah komentar',
        thread: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return addedComment entity correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const newComment = new NewComment({
        content: 'sebuah komentar',
        thread: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah komentar',
        owner: 'user-123',
      }));
    });
  });

  describe('function verifyAvailableComment', () => {
    it('should not throw NotFoundError when comment existed', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });
  });

  describe('function isAuthorized', () => {
    it('should throw AuthorizationError when user is not authorized to access', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const anotherUser = {
        id: 'user-456',
        username: 'fahram',
        password: '12011988',
        fullname: 'Khaidir Fahram',
      };
      await UsersTableTestHelper.addUser(anotherUser);

      // Action
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Assert
      expect(commentRepositoryPostgres.isAuthorized('comment-123', anotherUser.id))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error Authorization if user is authorized', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Assert
      expect(commentRepositoryPostgres.isAuthorized('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('function deleteComment', () => {
    it('should delete Comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const result = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(result[0].is_delete).toEqual(true);
    });
  });

  describe('function getAllCommentsOfThread', () => {
    it('should get all available and deleted comments of a thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        content: 'komentar lain',
        thread: 'thread-123',
        owner: 'user-123',
        is_delete: true,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getAllCommentsOfThread('thread-123');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].content).toEqual('sebuah komentar');
      expect(comments[0].username).toEqual('dicoding');
      expect(comments[0].date).toBeInstanceOf(Date);
      expect(comments[0].is_delete).toEqual(false);

      expect(comments[1].id).toEqual('comment-456');
      expect(comments[1].content).toEqual('**komentar telah dihapus**');
      expect(comments[1].username).toEqual('dicoding');
      expect(comments[1].date).toBeInstanceOf(Date);
      expect(comments[1].is_delete).toEqual(true);
    });
  });

  describe('checkCommentBelongsToThread', () => {
    it('should not throw error if comment exists in thread', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres
        .checkCommentBelongsToThread('thread-123', 'comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw error if comment is not in thread', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(commentRepositoryPostgres
        .checkCommentBelongsToThread('thread-xxx', 'comment-123'))
        .rejects.toThrowError(NotFoundError);
    });
  });
});
