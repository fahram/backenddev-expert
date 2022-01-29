/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123', comment = 'comment-123', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO likes (id, comment, owner) VALUES ($1, $2, $3)',
      values: [id, comment, owner],
    };

    await pool.query(query);
  },

  async getLikeByCommentAndOwner({ comment = 'comment-123', owner = 'user-123' }) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment = $1 AND owner = $2',
      values: [comment, owner],
    };
    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE likes');
  },

};

module.exports = LikesTableTestHelper;
