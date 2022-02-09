/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('threads', 'fk_threads.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.thread_threads.id', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.comment_comments.id', 'FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('likes', 'fk_likes.comment_comments.id', 'FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE');
  pgm.addConstraint('likes', 'fk_likes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('likes', 'no_duplicate_likes.comment_and_likes.owner', 'UNIQUE (comment, owner)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('threads', 'fk_threads.owner_users.id');
  pgm.dropConstraint('comments', 'fk_comments.thread_threads.id');
  pgm.dropConstraint('comments', 'fk_comments.owner_users.id');
  pgm.dropConstraint('replies', 'fk_replies.comment_comments.id');
  pgm.dropConstraint('replies', 'fk_replies.owner_users.id');
  pgm.dropConstraint('likes', 'fk_likes.comment_comments.id');
  pgm.dropConstraint('likes', 'fk_likes.owner_users.id');
  pgm.dropConstraint('likes', 'no_duplicate_likes.comment_and_likes.owner');
};
