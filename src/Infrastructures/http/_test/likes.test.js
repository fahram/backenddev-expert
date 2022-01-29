const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('endpoints concerning CRUD on comments', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when giving like ', async () => {
      // arrange
      /* add comment payload */
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login with said user
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const responseAuthJson = JSON.parse(responseAuth.payload); // get the acces token

      // add thread
      const responseAddThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah judul',
          body: 'sebuah body',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      const threadId = responseAddThreadJson.data.addedThread.id;

      // add comment
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      const commentId = responseAddCommentJson.data.addedComment.id;

      // action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);

      // assert
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 when giving unlike ', async () => {
      // arrange
      /* add comment payload */
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login with said user
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const responseAuthJson = JSON.parse(responseAuth.payload); // get the acces token

      // add thread
      const responseAddThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah judul',
          body: 'sebuah body',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const responseAddThreadJson = JSON.parse(responseAddThread.payload);
      const threadId = responseAddThreadJson.data.addedThread.id;

      // add comment
      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}` },
      });
      const responseAddCommentJson = JSON.parse(responseAddComment.payload);
      const commentId = responseAddCommentJson.data.addedComment.id;

      // action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
