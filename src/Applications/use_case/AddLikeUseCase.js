const NewLike = require('../../Domains/likes/entities/NewLike');

class AddLikeUseCase {
  constructor({
    commentRepository, likeRepository,
  }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const newLike = new NewLike(useCasePayload);
    await this._commentRepository.verifyAvailableComment(newLike.comment);
    return this._likeRepository.addLike(newLike);
  }
}

module.exports = AddLikeUseCase;
