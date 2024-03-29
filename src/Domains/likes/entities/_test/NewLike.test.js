const NewLike = require('../NewLike');

describe('a NewLike entity', () => {
  it('should throw error if payload does not meeet criteria', () => {
    // arrange
    const payload = {
      comment: 'comment-123',
    };

    // action & assert
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      comment: 234,
      owner: {},
    };

    // action & assert
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newLike object properly', () => {
    const payload = {
      comment: 'comment-123',
      owner: 'user-123',
    };

    const newLike = new NewLike(payload);
    expect(newLike.comment).toEqual(payload.comment);
    expect(newLike.owner).toEqual(payload.owner);
  });
});
