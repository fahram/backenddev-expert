const LikeRepository = require('../../Domains/likes/LikeRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(newLike) {
    const id = `like-${this._idGenerator(10)}`;
    const { comment, owner } = newLike;

    const query = {
      text: 'INSERT INTO likes (id, comment, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, comment, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getLikeById({ comment, owner }) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment = $1 AND owner = $2',
      values: [comment, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getLikeCountByComment(comment) {
    const query = {
      text: 'SELECT COUNT(*)::int FROM likes WHERE comment = $1',
      values: [comment],
    };

    const result = await this._pool.query(query);
    return result.rows[0].count;
  }

  async checkLikeIsExists({ comment, owner }) {
    const query = {
      text: 'SELECT 1 FROM likes WHERE comment = $1 AND owner = $2',
      values: [comment, owner],
    };
    const result = await this._pool.query(query);
    if (result.rows.length) {
      return true;
    }
    return false;
  }

  async deleteLikeByCommentAndOwner({ comment, owner }) {
    const query = {
      text: 'DELETE FROM likes WHERE comment = $1 AND owner = $2 RETURNING id',
      values: [comment, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('tidak bisa menghapus like karena like tidak ada');
    }
  }
}

module.exports = LikeRepositoryPostgres;
