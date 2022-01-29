const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(newLike) {
    const record = await this.getLikeById(newLike);
    const { comment, owner } = newLike;
    let query;

    if (!record) {
      const id = `like-${this._idGenerator(10)}`;

      query = {
        text: 'INSERT INTO likes (id, comment, owner) VALUES ($1, $2, $3) RETURNING 1 AS INDEX, id',
        values: [id, comment, owner],
      };
    } else {
      query = {
        text: 'DELETE FROM likes WHERE comment = $1 AND owner = $2 RETURNING -1 as INDEX, id',
        values: [comment, owner],
      };
    }

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
}

module.exports = LikeRepositoryPostgres;
