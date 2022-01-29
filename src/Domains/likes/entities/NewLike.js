class NewLike {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      comment, owner,
    } = payload;

    this.comment = comment;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    if (this._isPayloadNotContainNeededProperty(payload)) {
      throw new Error('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (this._isPayloadNotMeetDataTypeSpecification(payload)) {
      throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _isPayloadNotContainNeededProperty({ comment, owner }) {
    return (!comment || !owner);
  }

  _isPayloadNotMeetDataTypeSpecification({ comment, owner }) {
    return (
      typeof comment !== 'string'
         || typeof owner !== 'string'
    );
  }
}

module.exports = NewLike;
