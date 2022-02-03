const NewLike = require('../../Domains/likes/entities/NewLike');

class AddLikeUseCase {
  constructor({
    commentRepository, likeRepository,
  }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository.checkCommentBelongsToThread(
      useCasePayload.thread,
      useCasePayload.comment,
    );
    const newLike = new NewLike(useCasePayload);
    if (await this._likeRepository.checkLikeIsExists(newLike)) {
      await this._likeRepository.deleteLikeByCommentAndOwner(newLike);
    } else {
      await this._likeRepository.addLike(newLike);
    }
  }
}

module.exports = AddLikeUseCase;
