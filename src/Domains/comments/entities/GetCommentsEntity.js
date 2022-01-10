/* eslint-disable camelcase */
class GetCommentsEntity {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.is_delete
      ? '**komentar telah dihapus**'
      : payload.content;
    this.date = payload.date;
    this.username = payload.username;
    this.is_delete = payload.is_delete;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, is_delete,
    } = payload;
    if (!id || !username || !date || !content || is_delete === undefined) {
      throw new Error('GET_COMMENTS_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
        || typeof username !== 'string'
        || !(typeof date === 'string' || typeof date === 'object')
        || typeof content !== 'string'
        || typeof is_delete !== 'boolean'
    ) {
      throw new Error('GET_COMMENTS_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetCommentsEntity;
