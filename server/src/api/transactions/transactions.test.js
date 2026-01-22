const request = require('supertest');
const app = require('../../app');

describe('GET /api/ledgers/:ledgerId/transactions는', () => {
  describe('성공시', () => {
    test('해당 가계부의 거래 내역 목록을 담은 배열과 200을 반환한다.', async () => {
      const res = await request(app)
        .get('/api/ledgers/1/transactions')
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      res.body.map((transaction) => {
        expect(transaction).toHaveProperty('ledgerId', 1);
      });
    });

    test('거래 내역이 없을 경우 빈 배열과 200을 반환한다.', async () => {
      const res = await request(app)
        .get('/api/ledgers/3/transactions')
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('실패시', () => {
    test('ledgerId가 숫자가 아니면 400을 반환한다.', async () => {
      await request(app).get('/api/ledgers/abc/transactions').expect(400);
    });

    test('존재하지 않는 ledgerId이면 404를 반환한다.', async () => {
      await request(app).get('/api/ledgers/999/transactions').expect(404);
    });
  });
});
