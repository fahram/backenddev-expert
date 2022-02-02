const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  it('should be instance of LikeRepository domain', () => {
    const commentRepositoryPostgres = new LikeRepositoryPostgres({}, {});

    expect(commentRepositoryPostgres).toBeInstanceOf(LikeRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const firstComment = 'comment-123';
      const secondComment = 'comment-456';
      await UsersTableTestHelper.addUser({ id: userId, username: 'SomeUser' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: firstComment, owner: userId });
      await CommentsTableTestHelper.addComment({ id: secondComment, owner: userId });
    });
    afterEach(async () => {
      await LikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await LikesTableTestHelper.cleanTable();
      await pool.end();
    });
    describe('checkLikeExists function', () => {
      it('checkLikeExists should return true if like exists', async () => {
        await LikesTableTestHelper.addLike({ id: 'like-123', comment: 'comment-123', owner: 'user-123' });

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
        const statusCheck = await likeRepositoryPostgres.checkLikeIsExists({ comment: 'comment-123', owner: 'user-123' });
        expect(statusCheck).toEqual(true);
      });

      it('checkLikeExists should return false if like does not exists', async () => {
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
        const statusCheck = await likeRepositoryPostgres.checkLikeIsExists({ comment: 'comment-456', owner: 'user-456' });
        expect(statusCheck).toEqual(false);
      });
    });
    describe('addLike function', () => {
      it('addLike function should add database entry for said like', async () => {
        // arrange
        const newLike = new NewLike({
          comment: 'comment-123',
          owner: 'user-123',
        });
        const fakeIdGenerator = () => '123';

        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, fakeIdGenerator,
        );

        // action
        const addedLike = await likeRepositoryPostgres.addLike(newLike);
        const like = await LikesTableTestHelper.getLikeByCommentAndOwner(newLike);

        // assert
        expect(addedLike).toStrictEqual(({
          id: 'like-123',
        }));
        expect(like).toStrictEqual({
          id: 'like-123',
          comment: 'comment-123',
          owner: 'user-123',
        });
      });
    });
    describe('deleteLikeByCommentAndOwner function', () => {
      it('deleteLikeByCommentAndOwner should not throw error when deleting like', async () => {
        await LikesTableTestHelper.addLike({ id: 'like-123', comment: 'comment-123', owner: 'user-123' });

        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
        await expect(likeRepositoryPostgres.deleteLikeByCommentAndOwner({ comment: 'comment-123', owner: 'user-123' }))
          .resolves.not.toThrowError();
      });

      it('deleteLikeByCommentAndOwner should throw error when deleting non-existing like', async () => {
        const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {}, {});
        await expect(likeRepositoryPostgres.deleteLikeByCommentAndOwner({ comment: 'comment-123', owner: 'user-123' }))
          .rejects.toThrowError();
      });
    });
    describe('getLikeCountByComment function', () => {
      it('getLikeCountByComment function should get right likeCount #1', async () => {
        // arrange
        await LikesTableTestHelper.addLike({ comment: 'comment-123', owner: 'user-123' });

        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, {},
        );

        // action
        const likeCount = await likeRepositoryPostgres.getLikeCountByComment('comment-123');

        // asssert
        expect(likeCount).toEqual(1);
      });

      it('getLikeCountByComment function should get right likeCount #2', async () => {
        // arrange
        const comment = 'comment-456';

        const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, {},
        );

        // action
        const likeCount = await likeRepositoryPostgres.getLikeCountByComment(comment);

        // asssert
        expect(likeCount).toEqual(0);
      });
    });
  });
});
