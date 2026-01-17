const request = require('supertest');
const app = require('../../app');

describe('GET /api/ledgers는', () => {
  describe('성공시', () => {
    test('가계부 목록을 담은 배열을 반환한다.', async () => {
      const res = await request(app).get('/api/ledgers');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    test('limit이 있다면 limit 갯수만큼 가계부를 담은 배열을 반환한다.', async () => {
      const res = await request(app).get('/api/ledgers').query({ limit: 2 });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('실패시', () => {
    test('limit이 숫자형이 아닐 경우 400을 반환한다.', async () => {
      const res = await request(app).get('/api/ledgers').query({ limit: 'a' });

      expect(res.status).toBe(400);
    });
  });
});
