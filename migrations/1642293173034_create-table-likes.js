/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true,
    },
    comment: {
      type: 'VARCHAR(18)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(15)',
      notNull: true,
    },
  });
};
exports.down = (pgm) => {
  pgm.dropTable('likes');
};
