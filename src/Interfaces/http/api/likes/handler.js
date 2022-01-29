const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId: thread, commentId: comment } = request.params;
    request.params.owner = owner;
    request.params.comment = comment;
    request.params.thread = thread;
    const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name);

    await addLikeUseCase.execute(
      request.params,
    );
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
